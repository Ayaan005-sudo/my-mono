import { LocationType } from "@mono/database";

export type LocationHierarchyItem = {
  id: string;
  name: string;
  type: LocationType;
};

export type LocationByIdResponse = {
  id: string;
  name: string;
  type: LocationType;
  sourceCode: string;
  localBodyType: string | null;
  parentId: string | null;

  breadcrumb: LocationHierarchyItem[];
};


export type LocationChildResponse = {
  id: string;
  name: string;
  type: LocationType;
  sourceCode: string;
  localBodyType: string | null;
  parentId: string | null;
};