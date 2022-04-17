const APOLLO_RESOLVE_REFERENCE_FIELD_NAME = "__resolveReference";
const APOLLO_FIELD_NAME_PREFIX = "__";

function restoreReferenceResolvers(
  schema,
  resolvers,
  apolloFields = [APOLLO_RESOLVE_REFERENCE_FIELD_NAME]
) {
  const apolloFieldsSet = new Set(apolloFields);

  const typeMap = schema.getTypeMap();

  for (const [name, type] of Object.entries(typeMap)) {
    const typeResolvers = resolvers[name];

    if (typeResolvers) {
      const apolloResolverFieldNames = Object.keys(typeResolvers).filter(
        fieldName => apolloFieldsSet.has(fieldName)
      );

      for (const apolloResolverFieldName of apolloResolverFieldNames) {
        const trimmedName = apolloResolverFieldName.substring(
          APOLLO_FIELD_NAME_PREFIX.length
        );

        const apolloResolver = typeResolvers[apolloResolverFieldName];
        type[trimmedName] = apolloResolver;
      }
    }
  }
}

export default restoreReferenceResolvers;
