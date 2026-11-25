import { describe, expect, test } from "bun:test"

import {
  canonicalTag,
  filterPostsByTag,
  getAdjacentPosts,
  getTagCounts,
  slugify,
  tagHref,
} from "./post-tools"

const posts = [
  { slug: "c", tags: ["AIAgents", "SoftwareEngineering"] },
  { slug: "b", tags: ["SoftwareEngineering", "Complexity"] },
  { slug: "a", tags: ["Go"] },
]

describe("slugify", () => {
  test("lowercases and hyphenates", () => {
    expect(slugify("1. Context is written down once")).toBe(
      "1-context-is-written-down-once"
    )
  })

  test("drops apostrophes and accents, trims edges", () => {
    expect(slugify("What hasn't gotten easier?")).toBe("what-hasnt-gotten-easier")
    expect(slugify("Résumé — notes")).toBe("resume-notes")
  })
})

describe("getAdjacentPosts", () => {
  test("middle post has both neighbours", () => {
    const { newer, older } = getAdjacentPosts(posts, "b")
    expect(newer?.slug).toBe("c")
    expect(older?.slug).toBe("a")
  })

  test("ends of the list", () => {
    expect(getAdjacentPosts(posts, "c").newer).toBeUndefined()
    expect(getAdjacentPosts(posts, "a").older).toBeUndefined()
  })

  test("unknown slug", () => {
    expect(getAdjacentPosts(posts, "zzz")).toEqual({
      newer: undefined,
      older: undefined,
    })
  })
})

describe("tags", () => {
  test("no tag returns everything", () => {
    expect(filterPostsByTag(posts, null)).toHaveLength(3)
  })

  test("filters case-insensitively", () => {
    expect(filterPostsByTag(posts, "softwareengineering").map((p) => p.slug)).toEqual(
      ["c", "b"]
    )
    expect(filterPostsByTag(posts, "nope")).toEqual([])
  })

  test("canonicalTag restores the posts' spelling", () => {
    expect(canonicalTag(posts, "go")).toBe("Go")
    expect(canonicalTag(posts, "unknown")).toBe("unknown")
  })

  test("counts, most used first", () => {
    expect(getTagCounts(posts)[0]).toEqual({ tag: "SoftwareEngineering", count: 2 })
  })

  test("tagHref encodes", () => {
    expect(tagHref("C++ & Go")).toBe("/blog?tag=C%2B%2B%20%26%20Go")
  })
})
