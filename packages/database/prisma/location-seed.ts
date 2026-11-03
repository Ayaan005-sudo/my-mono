import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import {
  PrismaClient,
  LocationType,
} from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

type LocationRow = {
  location_key: string;
  name: string;
  entity_type: LocationType;
  parent_key: string;
  source_code: string;
  local_body_type: string;
  parent_status: string;
};

const BATCH_SIZE = 100;

async function processBatch(rows: LocationRow[]) {
  await Promise.all(
    rows.map((row) =>
      prisma.location.upsert({
        where: {
          id: row.location_key,
        },
        update: {
          name: row.name,
          type: row.entity_type,
          sourceCode: row.source_code,
          localBodyType: row.local_body_type || null,
          parentId: row.parent_key || null,
        },
        create: {
          id: row.location_key,
          name: row.name,
          type: row.entity_type,
          sourceCode: row.source_code,
          localBodyType: row.local_body_type || null,
          parentId: row.parent_key || null,
        },
      })
    )
  );
}

async function main() {
  const csvPath = path.join(
    process.cwd(),
    "prisma",
    "data",
    "locations_lgd_india.csv"
  );

  const csvFile = fs.readFileSync(csvPath, "utf-8");

  const rows = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as LocationRow[];

  console.log(`CSV me total ${rows.length} locations mili`);

  const validRows = rows.filter((row) => {
    if (row.entity_type !== "URBAN_LOCAL_BODY") {
      return true;
    }

    return row.parent_status === "OK";
  });

  const order: LocationType[] = [
    "COUNTRY",
    "STATE",
    "DISTRICT",
    "SUBDISTRICT",
    "URBAN_LOCAL_BODY",
  ];

  let totalProcessed = 0;

  for (const type of order) {
    const typeRows = validRows.filter(
      (row) => row.entity_type === type
    );

    console.log(`\nSeeding ${type}: ${typeRows.length}`);

    for (let i = 0; i < typeRows.length; i += BATCH_SIZE) {
      const batch = typeRows.slice(i, i + BATCH_SIZE);

      await processBatch(batch);

      totalProcessed += batch.length;

      console.log(
        `${type}: ${Math.min(
          i + BATCH_SIZE,
          typeRows.length
        )}/${typeRows.length} | Total: ${totalProcessed}`
      );
    }
  }

  console.log("\nLocation seeding complete");
  console.log(`Seeded: ${totalProcessed}`);
  console.log(`Skipped: ${rows.length - validRows.length}`);
}

main()
  .catch((error) => {
    console.error("Location seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });