import type { IUser, Paginated } from '@application/core/entity.core';

export type UserResponse = Omit<IUser, 'password'>;

export function toUserResponse(user: IUser): UserResponse {
  const { password: _password, ...rest } = user;
  return rest;
}

export function toUserPaginatedResponse(
  paginated: Paginated<IUser>,
): Paginated<UserResponse> {
  return {
    ...paginated,
    data: paginated.data.map(toUserResponse),
  };
}
