import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

export function useLiveSearch(
  query: string,
  searchUser: (query: string) => void,
) {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = debounce(() => {
    if (query.length >= 3) {
      searchUser(query);
    } else {
      setResult([]);
    }
  }, 1000);

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  return { result, loading, setLoading };
}
