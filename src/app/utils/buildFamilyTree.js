// Builds the "Family Relationships" list for a person page:
//   father
//   mother
//     ├ self
//     └ + spouse / partner      (one per co-parent of this person's children)
//          └ son / daughter
// Without parents, self and the spouses sit at the top level. The last row of the
// whole tree gets `lastItem` (no bottom border).
const UNKNOWN = "unknownPlaceholder";

// "Sanford Gray Ramsey" + "Ramsey" → "Sanford Ramsey"
const shortName = (person) => `${String(person.name).split(" ")[0]} ${person.surname || ""}`.trim();

const lifespan = (person) => `${person.birthYear || "????"} - ${person.deathYear || "????"}`;

const relative = (person, relationship) => ({
  relationship,
  name: shortName(person),
  link: person.slug,
  isLive: person.isLive,
  dates: lifespan(person),
});

export function buildFamilyTree(person) {
  const self = { name: shortName(person), relationship: "self" };

  // Group children under the other parent.
  const spouses = [];
  for (const child of person.childrenOfPerson || []) {
    const spouse = person.gender === "Female" ? child.father : child.mother;
    const spouseSlug = spouse ? spouse.slug : UNKNOWN;
    let group = spouses.find((s) => s.link === spouseSlug);
    if (!group) {
      group = {
        relationship: "spouse / partner",
        name: `+ ${spouse ? shortName(spouse) : "Unknown"}`,
        link: spouseSlug,
        isLive: spouse ? spouse.isLive : false,
        dates: spouse && (spouse.birthYear || spouse.deathYear) ? lifespan(spouse) : null,
        children: [],
      };
      spouses.push(group);
    }
    group.children.push(relative(child, child.gender === "Female" ? "daughter" : "son"));
  }

  let tree;
  if (person.father || person.mother) {
    tree = [
      person.father ? relative(person.father, "father") : { relationship: "father", name: "Unknown" },
      {
        ...(person.mother ? relative(person.mother, "mother") : { relationship: "mother", name: "Unknown" }),
        children: [self, ...spouses],
      },
    ];
  } else {
    tree = [self, ...spouses];
  }

  // Mark the very last row
  let last = tree[tree.length - 1];
  while (last.children?.length) last = last.children[last.children.length - 1];
  last.lastItem = true;

  return tree;
}

export default buildFamilyTree;
