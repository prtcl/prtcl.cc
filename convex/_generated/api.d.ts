/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as features from "../features.js";
import type * as internal_ from "../internal.js";
import type * as lib_invariants from "../lib/invariants.js";
import type * as lib_types from "../lib/types.js";
import type * as migrations from "../migrations.js";
import type * as projects from "../projects.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  features: typeof features;
  internal: typeof internal_;
  "lib/invariants": typeof lib_invariants;
  "lib/types": typeof lib_types;
  migrations: typeof migrations;
  projects: typeof projects;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
