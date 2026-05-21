import { httpResource, httpUpload, defineApiRoute, defineApiRouteFn } from "@core/http-resource";

export type Profile = {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt: string;
};

export type UpdateProfileRequest = {
  name?: string;
  bio?: string;
};

const detailRoute = defineApiRouteFn<{ userId: string }>(
  "GET",
  ({ userId }) => `/profiles/${userId}`,
);
const updateRoute = defineApiRouteFn<{ userId: string }>(
  "PATCH",
  ({ userId }) => `/profiles/${userId}`,
);
const uploadAvatarRoute = defineApiRouteFn<{ userId: string }>(
  "POST",
  ({ userId }) => `/profiles/${userId}/avatar`,
);

export function fetchProfile(userId: string, signal?: AbortSignal): Promise<Profile> {
  return httpResource(detailRoute, { params: { userId }, signal });
}

export function updateProfile(userId: string, body: UpdateProfileRequest): Promise<Profile> {
  return httpResource(updateRoute, { params: { userId }, body });
}

export function uploadAvatar(userId: string, formData: FormData): Promise<Profile> {
  return httpUpload(uploadAvatarRoute, { params: { userId }, formData });
}
