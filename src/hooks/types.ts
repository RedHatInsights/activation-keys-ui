import type { ReactNode } from 'react';

/**
 * Domain models for the RHSM v2 API, colocated with the hooks that fetch them.
 */

export interface AdditionalRepository {
  repositoryLabel: string;
  repositoryName?: string;
}

/** A repository returned by the `available_repositories` endpoint. */
export interface AvailableRepository extends AdditionalRepository {
  repositoryName: string;
  rpmType: string;
  architecture: string;
}

export interface ActivationKey {
  name: string;
  description?: string;
  role?: string;
  serviceLevel?: string;
  usage?: string;
  releaseVersion?: string;
  releaseProduct?: string;
  additionalRepositories?: AdditionalRepository[];
  updatedAt?: string;
}

export interface SystemPurposeAttributes {
  roles: string[];
  serviceLevel: string[];
  usage: string[];
}

export interface EusConfiguration {
  version: string;
  repositories: string[];
}

/** An extended-update-support product and the versions it can be locked to. */
export interface EusProduct {
  name: string;
  configurations: EusConfiguration[];
}

export interface Pagination {
  total: number;
  offset?: number;
  limit?: number;
}

export interface AvailableRepositoriesResponse {
  body: AvailableRepository[];
  pagination: Pagination;
}

/** The rhsm v2 API wraps successful payloads in a `body` property. */
export interface ApiResponse<T> {
  body: T;
}

export interface Workspace {
  id: string;
}

export type NotificationVariant = 'success' | 'danger' | 'info' | 'warning';

export interface NotificationOptions {
  hasTimeout?: boolean;
  /**
   * NOTE: currently ignored by NotificationProvider, which reads `hasTimeout`.
   * Retained because existing callers pass it.
   */
  timeout?: number | boolean;
  description?: ReactNode;
  alertLinkText?: string;
  alertLinkHref?: string;
  alertLinkIsDownload?: boolean;
  keyOfAlertToReplace?: string;
}

export interface Notification {
  variant: NotificationVariant;
  message: string;
  key: string;
  timeout: number | boolean;
  description?: ReactNode;
  actionLinks?: ReactNode;
  downloadHref?: string;
}

/** `chrome.auth.getToken()` is awaited lazily by the fetch helpers. */
export type AuthToken = Promise<string | undefined> | undefined;

export type SortDirection = 'asc' | 'desc';

export interface AvailableRepositoriesFilters {
  repo_name?: string;
  repo_label?: string;
  rpm_type?: string[];
  architecture?: string[];
}
