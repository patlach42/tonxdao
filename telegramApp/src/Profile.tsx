import {useWebAppUser} from "./TelegramAppProvider.tsx";

export function Profile() {
  const user = useWebAppUser();
  return (
    <>
      <div>{user?.id}</div>
      <div>{user?.username}</div>
      <div>{user?.first_name}</div>
      <div>{user?.last_name}</div>
    </>
  );
}