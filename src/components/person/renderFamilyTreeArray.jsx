export const renderFamilyTreeArray = (data) => {
  let familyArray = [];

  // figure out children and spouses
  let spouseWithChildren = [];
  if (data.childrenOfPerson && data.childrenOfPerson.length > 0) {
    data.childrenOfPerson.map((c) => {
      // are we looking for a father or mother?
      let spouse = c.mother;
      if (data.gender === 'Female') {
        spouse = c.father;
      }

      const spouseInArray = spouseWithChildren.findIndex((o) =>
        o.slug === spouse ? spouse.slug : 'unknownPlaceholder'
      );

      const childInfo = {
        relationship: c.gender === 'Female' ? 'daughter' : 'son',
        name: `${c.name} ${c.surname}`,
        link: c.slug,
        isLive: c.isLive,
        dates: `${c.birthYear ? c.birthYear : '????'} - ${
          c.deathYear ? c.deathYear : '????'
        }`,
      };

      const spouseInfo = {
        relationship: 'spouse / partner',
        name: `+ ${spouse ? `${spouse.name} ${spouse.surname}` : 'Unknown'}`,
        link: spouse ? spouse.slug : 'unknownPlaceholder',
        isLive: spouse ? spouse.isLive : null,
        dates:
          spouse && (spouse.birthYear || spouse.deathYear)
            ? `${spouse.birthYear ? spouse.birthYear : '????'} -
                ${spouse.deathYear ? spouse.deathYear : '????'}`
            : null,
      };

      if (spouseInArray >= 0) {
        spouseWithChildren[spouseInArray].childrenOfPerson.push(childInfo);
      } else if (spouseInArray < 0) {
        spouseWithChildren.push({
          ...spouseInfo,
          childrenOfPerson: [
            {
              ...childInfo,
            },
          ],
        });
      }
    });
  }

  // parents
  if (data.mother || data.father) {
    // father
    if (data.father) {
      familyArray.push({
        relationship: 'father',
        name: `${data.father.name} ${data.father.surname}`,
        link: data.father.slug,
        isLive: data.isLive,
        dates: `${data.father.birthYear ? data.father.birthYear : '????'} - ${
          data.father.deathYear ? data.father.deathYear : '????'
        }`,
      });
    } else {
      familyArray.push({
        relationship: 'father',
        name: 'Unknown',
      });
    }

    // mother
    if (data.mother) {
      familyArray.push({
        relationship: 'mother',
        name: `${data.mother.name} ${data.mother.surname}`,
        link: data.mother.slug,
        isLive: data.mother.isLive,
        dates: `${data.mother.birthYear ? data.mother.birthYear : '????'} - ${
          data.mother.deathYear ? data.mother.deathYear : '????'
        }`,
        childrenOfPerson: [
          {
            name: `${data.name} ${data.surname}`,
            relationship: 'self',
          },
          ...spouseWithChildren,
        ],
      });
    } else {
      familyArray.push({
        relationship: 'mother',
        name: 'Unknown',
        childrenOfPerson: [
          {
            name: `${data.name} ${data.surname}`,
            relationship: 'self',
          },
          ...spouseWithChildren,
        ],
      });
    }
  } else {
    // no parents
    familyArray.push({
      name: `${data.name} ${data.surname}`,
      relationship: 'self',
    });
    familyArray = familyArray.concat(spouseWithChildren);
  }

  // figure out who is last in the nested array
  if (familyArray[familyArray.length - 1].childrenOfPerson) {
    if (
      familyArray[familyArray.length - 1].childrenOfPerson[
        familyArray[familyArray.length - 1].childrenOfPerson.length - 1
      ].childrenOfPerson
    ) {
      familyArray[familyArray.length - 1].childrenOfPerson[
        familyArray[familyArray.length - 1].childrenOfPerson.length - 1
      ].childrenOfPerson[
        familyArray[familyArray.length - 1].childrenOfPerson[
          familyArray[familyArray.length - 1].childrenOfPerson.length - 1
        ].childrenOfPerson.length - 1
      ].lastItem = true;
    } else {
      familyArray[familyArray.length - 1].childrenOfPerson[
        familyArray[familyArray.length - 1].childrenOfPerson.length - 1
      ].lastItem = true;
    }
  } else {
    familyArray[familyArray.length - 1].lastItem = true;
  }

  return familyArray;
};

export default renderFamilyTreeArray;
