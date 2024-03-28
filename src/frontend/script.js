document
  .getElementById("phoneForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var phoneNumber = document.getElementById("phoneNumber").value;

    fetch("/submitPhoneNumber", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phoneNumber }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  });
