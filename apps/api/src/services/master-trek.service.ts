import {
  findLocationById,
  createActivity,
  createMasterTrekRepo,
  createNearbyPlace,
  createTrekNearbyPlace,
  addTrekToActivities,
  deleteRoutesByTrekId,
  updateMasterTrekRepo,
  findNearbyLinks,
  deleteNearbyLinks,
  deleteNearbyPlacesByIds,
  getCompleteMasterTrek,
  findMasterTrekById,
  getMasterTrekByIdAdmin,
  deleteMasterTrekById,
  getAllMasterTreksAdmin,
  getAllMasterTreksVendor,
  getMasterTrekByIdVendor,
  getAllMasterTreksUser,
  getMasterTrekByIdUser,
} from "../repositories/master-trek.repository.js";

import type { CreateMasterTrekRequest, GetAllMasterTreksResponse, GetAllMasterTreksUserResponse, GetAllMasterTreksVendorResponse, MasterTrekByIdResponse, MasterTrekUserListItemResponse, MasterTrekUserResponse, MasterTrekVendorResponse, UpdateMasterTrekRequest } from "../types/index.js";
import { CustomError } from "../utils/custom-error.js";
import type { MasterTrek } from "@mono/database";
import { uuidv7 } from "uuidv7";


export const createMasterTrek = async (
  data: CreateMasterTrekRequest,
  userId: string,
): Promise<MasterTrek> => {
  try {
    const location = await findLocationById(
      data.locationId,
    );

    if (!location) {
      throw new CustomError(
        "Invalid trek location",
        400,
      );
    }

    const trekActivities = await Promise.all(
      data.activities.map((activity) =>
        createActivity(
          uuidv7(),
          activity.name,
          activity.description,
          activity.iconUrl,
        ),
      ),
    );

    const trekActivityIds = trekActivities.map(
      (activity) => activity.id,
    );

    const routes = await Promise.all(
      data.routes.map(async (route) => {
        const itineraryDays = await Promise.all(
          route.itineraryDays.map(
            async (day) => {
              const activities =
                await Promise.all(
                  day.activities.map(
                    (activity) =>
                      createActivity(
                        uuidv7(),
                        activity.name,
                        activity.description,
                        activity.iconUrl,
                      ),
                  ),
                );

              return {
                id: uuidv7(),
                dayNumber: day.dayNumber,
                title: day.title,
                description:
                  day.description,
                startLocation:
                  day.startLocation,
                endLocation:
                  day.endLocation,
                distanceKm:
                  day.distanceKm,
                duration: day.duration,
                altitude: day.altitude,
                imageUrls: day.imageUrls,
                activityIds:
                  activities.map(
                    (activity) =>
                      activity.id,
                  ),
              };
            },
          ),
        );

        return {
          id: uuidv7(),
          name: route.name,
          description:
            route.description,
          distanceKm:
            route.distanceKm,
          difficulty:
            route.difficulty,
          elevationGain:
            route.elevationGain,
          ascentTime:
            route.ascentTime,
          descentTime:
            route.descentTime,
          startPoint:
            route.startPoint,
          endPoint:
            route.endPoint,
          isPopular:
            route.isPopular,
          isDefault:
            route.isDefault,

          itineraryDays: {
            create: itineraryDays,
          },
        };
      }),
    );

    const trek =
      await createMasterTrekRepo({
        id: uuidv7(),

        name: data.name,

        slug: data.name
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-",
          )
          .replace(
            /^-|-$/g,
            "",
          ),

        shortDescription:
          data.shortDescription,
        description:
          data.description,
        tagline: data.tagline,

        difficulty:
          data.difficulty,
        durationDays:
          data.durationDays,
        maxAltitude:
          data.maxAltitude,
        distanceKm:
          data.distanceKm,
        distinctRoutes:
          data.distinctRoutes,

        locationId:
          data.locationId,

        latitude:
          data.latitude,
        longitude:
          data.longitude,

        bestSeason:
          data.bestSeason,
        beginnerFriendly:
          data.beginnerFriendly,

        overview:
          data.overview,
        howToReach:
          data.howToReach,
        fitnessInfo:
          data.fitnessInfo,
        safetyInfo:
          data.safetyInfo,
        permitInfo:
          data.permitInfo,
        sustainabilityInfo:
          data.sustainabilityInfo,

        coverImageUrl:
          data.coverImageUrl,
        videoUrl:
          data.videoUrl,
        galleryImages:
          data.galleryImages,

        status:
          data.status,

        createdById:
          userId,

        activityIds:
          trekActivityIds,

        routes: {
          create: routes,
        },

        faqs: {
          create: data.faqs.map((faq, index) => ({
            id: uuidv7(),
            question: faq.question,
            answer: faq.answer,
            order: faq.order ?? index,
          })),
        },
      });

    await addTrekToActivities(
      trekActivityIds,
      trek.id,
    );

    for (const place of data.nearbyPlaces) {
      const nearbyPlace =
        await createNearbyPlace({
          id: uuidv7(),
          name: place.name,
          description:
            place.description,
          locationId:
            place.locationId,
          latitude:
            place.latitude,
          longitude:
            place.longitude,
          imageUrl:
            place.imageUrl,
        });

      await createTrekNearbyPlace({
        id: uuidv7(),
        trekId: trek.id,
        nearbyPlaceId:
          nearbyPlace.id,
        distanceFromTrek:
          place.distanceFromTrek,
        travelTime:
          place.travelTime,
      });
    }

    return trek;
  } catch (error) {
    console.error(
    "ACTUAL CREATE MASTER TREK ERROR:",
    error,
  );
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      "Failed to create trek",
      500,
    );
  }
};


export const updateMasterTrekService = async (
  trekId: string,
  data: UpdateMasterTrekRequest,
): Promise<MasterTrekByIdResponse> => {
  try {
    const existing =
      await findMasterTrekById(trekId);

    if (!existing) {
      throw new CustomError(
        "Trek not found",
        404,
      );
    }

    if (data.locationId !== undefined) {
      const location =
        await findLocationById(
          data.locationId,
        );

      if (!location) {
        throw new CustomError(
          "Invalid trek location",
          400,
        );
      }
    }

    const {
      activities,
      routes,
      nearbyPlaces,
      faqs,
      ...trekData
    } = data;

    let activityIds:
      | string[]
      | undefined;

    if (activities !== undefined) {
      const result =
        await Promise.all(
          activities.map((activity) =>
            createActivity(
              uuidv7(),
              activity.name,
              activity.description,
              activity.iconUrl,
            ),
          ),
        );

      activityIds = result.map(
        (activity) => activity.id,
      );
    }

    if (routes !== undefined) {
      await deleteRoutesByTrekId(
        trekId,
      );
    }

    const builtRoutes =
      routes !== undefined
        ? await Promise.all(
          routes.map(
            async (route) => {
              const itineraryDays =
                await Promise.all(
                  route.itineraryDays.map(
                    async (day) => {
                      const activities =
                        await Promise.all(
                          day.activities.map(
                            (activity) =>
                              createActivity(
                                uuidv7(),
                                activity.name,
                                activity.description,
                                activity.iconUrl,
                              ),
                          ),
                        );

                      return {
                        id: uuidv7(),
                        dayNumber:
                          day.dayNumber,
                        title:
                          day.title,
                        description:
                          day.description,
                        startLocation:
                          day.startLocation,
                        endLocation:
                          day.endLocation,
                        distanceKm:
                          day.distanceKm,
                        duration:
                          day.duration,
                        altitude:
                          day.altitude,
                          imageUrls: day.imageUrls,
                        activityIds:
                          activities.map(
                            (activity) =>
                              activity.id,
                          ),
                      };
                    },
                  ),
                );

              return {
                id: uuidv7(),
                name: route.name,
                description:
                  route.description,
                distanceKm:
                  route.distanceKm,
                difficulty:
                  route.difficulty,
                elevationGain:
                  route.elevationGain,
                ascentTime:
                  route.ascentTime,
                descentTime:
                  route.descentTime,
                startPoint:
                  route.startPoint,
                endPoint:
                  route.endPoint,
                isPopular:
                  route.isPopular,
                isDefault:
                  route.isDefault,

                itineraryDays: {
                  create:
                    itineraryDays,
                },
              };
            },
          ),
        )
        : undefined;

    const trek =
      await updateMasterTrekRepo(
        trekId,
        {
          ...trekData,

           ...(data.name !== undefined &&
        data.name !== existing.name && {
          slug: data.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        }),

          ...(activityIds && {
            activityIds,
          }),

          ...(builtRoutes && {
            routes: {
              create: builtRoutes,
            },
          }),

          ...(faqs !== undefined && {
            faqs: {
              deleteMany: {},
              create: faqs.map((faq, index) => ({
                id: uuidv7(),
                question: faq.question,
                answer: faq.answer,
                order: faq.order ?? index,
              })),
            },
          }),
        },
      );

    if (nearbyPlaces !== undefined) {
      const links =
        await findNearbyLinks(
          trekId,
        );

      await deleteNearbyLinks(
        trekId,
      );

      await deleteNearbyPlacesByIds(
        links.map(
          (link) =>
            link.nearbyPlaceId,
        ),
      );

      for (const place of nearbyPlaces) {
        const nearby =
          await createNearbyPlace({
            id: uuidv7(),
            name: place.name,
            description:
              place.description,
            locationId:
              place.locationId,
            latitude:
              place.latitude,
            longitude:
              place.longitude,
            imageUrl:
              place.imageUrl,
          });

        await createTrekNearbyPlace({
          id: uuidv7(),
          trekId,
          nearbyPlaceId:
            nearby.id,
          distanceFromTrek:
            place.distanceFromTrek,
          travelTime:
            place.travelTime,
        });
      }
    }

    const updatedTrek =
      await getCompleteMasterTrek(
        trek.id,
      );


    if (!updatedTrek) {
      throw new CustomError(
        "Trek not found after update",
        404,
      );
    }

    return updatedTrek;

  } catch (error) {
    console.error(
    "ACTUAL UPDATE MASTER TREK ERROR:",
    error,
  );
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      "Failed to update trek",
      500,
    );
  }
};


export const getMasterTrekByIdAdminService = async (
  trekId: string,
): Promise<MasterTrekByIdResponse | null> => {
  const trek =
    await getMasterTrekByIdAdmin(trekId);

  if (!trek) {
    throw new CustomError(
      "Trek not found",
      404,
    );
  }

  return trek;
};


export const deleteMasterTrekService = async (
  trekId: string,
) => {
  const existing =
    await findMasterTrekById(trekId);

  if (!existing) {
    throw new CustomError(
      "Trek not found",
      404,
    );
  }

  await deleteMasterTrekById(trekId);

  return {
    id: trekId,
  };
};


export const getAllMasterTreksAdminService = async (
  limit: number,
  cursor?: string,
): Promise<GetAllMasterTreksResponse> => {
  const treks =
    await getAllMasterTreksAdmin(
      limit,
      cursor,
    );

  const hasNextPage =
    treks.length > limit;

  const data = hasNextPage
    ? treks.slice(0, limit)
    : treks;

  const nextCursor =
    hasNextPage && data.length > 0
      ? data[data.length - 1].id
      : null;

  return {
    treks: data,
    nextCursor,
    hasNextPage,
  };
};


export const getAllMasterTreksVendorService = async (
  limit: number,
  cursor?: string,
): Promise<GetAllMasterTreksVendorResponse> => {
  const treks =
    await getAllMasterTreksVendor(
      limit,
      cursor,
    );

  const hasNextPage =
    treks.length > limit;

  const data = hasNextPage
    ? treks.slice(0, limit)
    : treks;

  const nextCursor =
    hasNextPage && data.length > 0
      ? data[data.length - 1].id
      : null;

  return {
    treks: data,
    nextCursor,
    hasNextPage,
  };
};


export const getMasterTrekByIdVendorService = async (
  trekId: string,
): Promise<MasterTrekVendorResponse> => {
  const trek =
    await getMasterTrekByIdVendor(trekId);

  if (!trek) {
    throw new CustomError(
      "Trek not found",
      404,
    );
  }

  return trek;
};


export const getAllMasterTreksUserService = async (
  limit: number,
  cursor?: string,
): Promise<GetAllMasterTreksUserResponse> => {
  const treks =
    await getAllMasterTreksUser(
      limit,
      cursor,
    );

  const hasNextPage =
    treks.length > limit;

  const data = hasNextPage
    ? treks.slice(0, limit)
    : treks;

  const nextCursor =
    hasNextPage && data.length > 0
      ? data[data.length - 1].id
      : null;

  const formattedTreks: MasterTrekUserListItemResponse[] = data.map((trek) => {
    let startingPrice: number | null = null;
    let currency: string | null = null;

    for (const pkg of trek.packages) {
      for (const schedule of pkg.schedules) {
        if (startingPrice === null || schedule.price < startingPrice) {
          startingPrice = schedule.price;
          currency = schedule.currency;
        }
      }
    }

    const { packages, ...rest } = trek;

    return {
      ...rest,
      startingPrice,
      currency,
    };
  });

  return {
    treks: formattedTreks,
    nextCursor,
    hasNextPage,
  };
};


export const getMasterTrekByIdUserService = async (
  trekId: string,
): Promise<MasterTrekUserResponse> => {
  const trek = await getMasterTrekByIdUser(trekId);

  if (!trek) {
    throw new CustomError(
      "Trek not found",
      404,
    );
  }

  let startingPrice: number | null = null;
  let currency: string | null = null;

  for (const pkg of trek.packages) {
    for (const schedule of pkg.schedules) {
      if (startingPrice === null || schedule.price < startingPrice) {
        startingPrice = schedule.price;
        currency = schedule.currency;
      }
    }
  }

  const { packages, ...rest } = trek;

  return {
    ...rest,
    startingPrice,
    currency,
  };
};
