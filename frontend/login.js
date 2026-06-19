async function login() {

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            sessionStorage.setItem(
                "loggedIn",
                "true"
            );

            window.location.href =
            "dashboard.html";

        } else {

            alert("Invalid Credentials");

        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server. Make sure backend is running."
        );

    }

}