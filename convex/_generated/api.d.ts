/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as generation from "../generation.js";
import type * as internal_ from "../internal.js";
import type * as lib_anthropic from "../lib/anthropic.js";
import type * as lib_invariants from "../lib/invariants.js";
import type * as lib_prompts from "../lib/prompts.js";
import type * as migrations from "../migrations.js";
import type * as projects from "../projects.js";
import type * as summaries from "../summaries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  generation: typeof generation;
  internal: typeof internal_;
  "lib/anthropic": typeof lib_anthropic;
  "lib/invariants": typeof lib_invariants;
  "lib/prompts": typeof lib_prompts;
  migrations: typeof migrations;
  projects: typeof projects;
  summaries: typeof summaries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
