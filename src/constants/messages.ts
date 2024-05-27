interface Tlength {
  field: string;
  condition: 'at least' | 'at most'; // inclusive
  length: number;
}

export const messages = {
  length(params: Tlength) {
    const { field, condition, length } = params;
    if (condition === 'at least') {
      return `${field} must be of at least ${length} characters.`;
    }

    return `${field} must be within the length of ${length}.`;
  },

  regex: {
    alphanumeric_underscores(field: string) {
      return `${field} can only contain alphanumeric characters and underscores.`;
    },
    alpha(field: string) {
      return `${field} can only contain alphabetic characters.`;
    },
  },
};
