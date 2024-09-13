interface UserListProps {
  result: any[];
  setSelectedUser: (selected: string) => void;
}

export default function UserList({ result, setSelectedUser }: UserListProps) {
  return (
    <ul className="mt-1">
      {result.map((item, index) => (
        <li key={index}>
          <button
            type="button"
            onClick={() => setSelectedUser(item.username)}
            aria-label={`Select ${item.username}`}
          >
            {item.username}
          </button>
        </li>
      ))}
    </ul>
  );
}
