interface TExpectedResponse {
  id: number;
  username: string;
}

interface ListUsersProps {
  users: TExpectedResponse[];
  onSelectUser: (username: string) => void;
}

export default function ListUsers({ users, onSelectUser }: ListUsersProps) {
  return (
    <ul className="mt-1">
      {users.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelectUser(item.username)}
            aria-label={`Select ${item.username}`}
          >
            {item.username}
          </button>
        </li>
      ))}
      {users.length === 0 && <p className="mt-1">No result found</p>}
    </ul>
  );
}
