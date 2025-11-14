import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import axiosInstance from "../../shared/lib/axiosInstace";

export default function CookiesPage() {
  const getCookieHandler = async () => {
    const response = await axiosInstance("/cookie");
    console.log(response);
  };
  const deleteCookieHandler = async () => {
    const response = await axiosInstance.delete("/cookie");
    console.log(response);
  };
  const myCookieHandler = async () => {
    const response = await axiosInstance("/my-cookie");
    console.log(response);
  };
  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        CookiesPage
      </h1>
      <ButtonGroup
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        aria-label="Basic example"
      >
        <Button
          variant="secondary"
          style={{ marginRight: "25px" }}
          onClick={getCookieHandler}
        >
          Get cookie
        </Button>
        <Button
          variant="secondary"
          style={{ marginRight: "25px" }}
          onClick={deleteCookieHandler}
        >
          Delete cookie
        </Button>
        <Button
          variant="secondary"
          style={{ marginRight: "25px" }}
          onClick={myCookieHandler}
        >
          My cookie
        </Button>
      </ButtonGroup>
    </>
  );
}
