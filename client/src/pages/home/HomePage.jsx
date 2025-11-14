export default function HomePage({user}) {
  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        Добро пожаловать на главную страницу {`${user?.data?.name}`}
      </h1>
    </>
  );
}
