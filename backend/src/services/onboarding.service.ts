import { prisma }
from "../config/prisma.js";

export class OnboardingService {

  static async get(
    userId: string
  ) {
    return prisma.profile.findUnique({
      where: {
        userId,
      },

      include: {
        goals: true,
      },
    });
  }

  static async save(
    userId: string,
    data: any
  ) {

    const {
      goal,
      ...profileData
    } = data;

    return prisma.$transaction(
      async (tx) => {

        const profile =
          await tx.profile.upsert({
            where: {
              userId,
            },

            update: {
              ...profileData,

              onboardingCompleted:
                true,

              onboardingCompletedAt:
                new Date(),
            },

            create: {
              userId,

              ...profileData,

              onboardingCompleted:
                true,

              onboardingCompletedAt:
                new Date(),
            },
          });

        await tx.goalSetting.updateMany({
          where: {
            profileId: profile.id,
          },

          data: {
            isActive: false,
          },
        });

        await tx.goalSetting.create({
          data: {
            profileId:
              profile.id,

            goal,

            isActive: true,
          },
        });

        return tx.profile.findUnique({
          where: {
            id: profile.id,
          },

          include: {
            goals: true,
          },
        });
      }
    );
  }
}