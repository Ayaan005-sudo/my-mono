import { searchLocations , findLocationByIdRepo , getLocationChildren} from "../repositories/location.repository.js";
import type { Location } from "@mono/database";
import { CustomError } from "../utils/custom-error.js";
import type { LocationByIdResponse, LocationHierarchyItem , LocationChildResponse} from "../types/location.js";



export const searchLocationsService = async (
  search: string,
): Promise<Location[]> => {
  const locations =
    await searchLocations(search, 10);

  return locations;
};

export const getLocationByIdService = async (
  locationId: string,
): Promise<LocationByIdResponse> => {
  const location =
    await findLocationByIdRepo(locationId);

  if (!location) {
    throw new CustomError(
      "Location not found",
      404,
    );
  }

  const breadcrumb: LocationHierarchyItem[] = [];

  let current = location;

  while (current) {
    breadcrumb.push({
      id: current.id,
      name: current.name,
      type: current.type,
    });

    if (!current.parentId) {
      break;
    }

    const parent =
      await findLocationByIdRepo(
        current.parentId,
      );

    if (!parent) {
      break;
    }

    current = parent;
  }

  return {
    id: location.id,
    name: location.name,
    type: location.type,
    sourceCode: location.sourceCode,
    localBodyType:
      location.localBodyType,
    parentId: location.parentId,

    breadcrumb,
  };
};

export const getLocationChildrenService = async (
  locationId: string,
): Promise<LocationChildResponse[]> => {
  const location =
    await findLocationByIdRepo(locationId);

  if (!location) {
    throw new CustomError(
      "Location not found",
      404,
    );
  }

  const children =
    await getLocationChildren(
      locationId,
    );

  return children;
};