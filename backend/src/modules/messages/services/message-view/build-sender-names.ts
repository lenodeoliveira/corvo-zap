import type IUserRepository from '@/modules/users/interfaces/user.repository.interface';

export async function buildSenderNamesByUserId(
  userRepository: IUserRepository,
  userIds: string[],
): Promise<Record<string, string>> {
  const users = await Promise.all(
    userIds.map((userId) => userRepository.findById(userId)),
  );

  const senderNames: Record<string, string> = {};

  for (const user of users) {
    if (user) {
      senderNames[user.getId()] = user.getName();
    }
  }

  return senderNames;
}
