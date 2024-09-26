const apiUrl = "http://localhost:3001";

async function signup(email, password) {
  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

async function login(email, password) {
  const response = await fetch(
    `${apiUrl}/users?email=${email}&password=${password}`
  );
  const user = await response.json();
  return user.length ? user[0] : null;
}

async function postImage(userId, imageUrl) {
  const response = await fetch(`${apiUrl}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      imageUrl,
      likes: 0,
      shares: 0,
      comments: [],
    }),
  });
  return await response.json();
}

async function getUserPosts(userId) {
  const response = await fetch(`${apiUrl}/posts?userId=${userId}`);
  return await response.json();
}

async function updatePost(postId, updatedData) {
  await fetch(`${apiUrl}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
}

async function deletePost(postId) {
  await fetch(`${apiUrl}/posts/${postId}`, {
    method: "DELETE",
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const appDiv = document.getElementById("app");
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage

  if (userId) {
    // If user ID exists, directly show the image upload form
    showImageUploadForm(userId);
    await renderUserPosts(userId);
  } else {
    // If no user ID, show login/signup form
    appDiv.innerHTML = `
            <div class="flex justify-center items-center min-h-screen">
                <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
                    <input type="email" id="loginEmail" class="border border-gray-300 p-2 w-full mb-4 rounded" placeholder="Email" />
                    <input type="password" id="loginPassword" class="border border-gray-300 p-2 w-full mb-4 rounded" placeholder="Password" />
                    <button id="loginBtn" class="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200 w-full">Login</button>
                    
                    <p class="mt-4 text-center">Don't have an account? 
                        <a id="showSignup" class="text-blue-500 cursor-pointer hover:underline">Sign up</a>
                    </p>

                    <div id="signupForm" class="hidden mt-6">
                        <h2 class="text-2xl font-bold mb-4 text-center">Signup</h2>
                        <input type="email" id="signupEmail" class="border border-gray-300 p-2 w-full mb-4 rounded" placeholder="Email" />
                        <input type="password" id="signupPassword" class="border border-gray-300 p-2 w-full mb-4 rounded" placeholder="Password" />
                        <button id="signupBtn" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-full">Signup</button>
                    </div>
                </div>
            </div>
        `;

    // Toggle between login and signup
    document.getElementById("showSignup").addEventListener("click", () => {
      const signupForm = document.getElementById("signupForm");
      signupForm.classList.toggle("hidden");
      const heading = document.querySelector("h2");
      heading.textContent = signupForm.classList.contains("hidden")
        ? "Login"
        : "Signup";
    });

    document.getElementById("signupBtn").addEventListener("click", async () => {
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const user = await signup(email, password);
      console.log("User signed up:", user);
    });

    document.getElementById("loginBtn").addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const user = await login(email, password);
      if (user) {
        console.log("User logged in:", user);
        localStorage.setItem("userId", user.id); // Store user ID in localStorage
        showImageUploadForm(user.id);
        await renderUserPosts(user.id);
      } else {
        console.log("Invalid credentials");
      }
    });
  }
});

function showImageUploadForm(userId) {
  const appDiv = document.getElementById("app");
  const uploadForm = `
        <div class="flex justify-center items-center min-h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 class="text-2xl font-bold mb-4 text-center">Upload Image</h2>
                <input type="file" id="imageUpload" class="border border-gray-300 p-2 w-full mb-4 rounded" />
                <button id="uploadBtn" class="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-200 w-full">Upload Image</button>
                
                <h2 class="text-xl font-bold mt-6 mb-2">Your Images</h2>
                <div id="imageGallery" class="grid grid-cols-1 gap-4"></div>
                <button id="logoutBtn" class="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 mt-4 w-full">Logout</button>
            </div>
        </div>
    `;

  appDiv.innerHTML = uploadForm;

  document.getElementById("uploadBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const imageUrl = reader.result; // Base64 URL of the image
      await postImage(userId, imageUrl);
      console.log("Image posted");
      renderUserPosts(userId); // Refresh the gallery
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.log("Please select an image file");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userId"); // Clear user ID from localStorage
    appDiv.innerHTML = ""; // Clear the app div
    location.reload(); // Reload the page
  });
}

async function renderUserPosts(userId) {
  const gallery = document.getElementById("imageGallery");
  gallery.innerHTML = ""; // Clear the gallery

  const posts = await getUserPosts(userId);
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "bg-gray-200 p-4 rounded shadow";

    const imgElement = document.createElement("img");
    imgElement.src = post.imageUrl;
    imgElement.alt = "User uploaded image";
    imgElement.className = "w-full h-auto rounded";

    const likeButton = document.createElement("button");
    likeButton.textContent = `Like (${post.likes})`;
    likeButton.className =
      "bg-blue-500 text-white p-2 rounded mt-2 mr-2 hover:bg-blue-600 transition duration-200";
    likeButton.addEventListener("click", async () => {
      post.likes++;
      await updatePost(post.id, { likes: post.likes });
      renderUserPosts(userId); // Refresh the gallery to show updated likes
    });

    const shareButton = document.createElement("button");
    shareButton.textContent = `Share (${post.shares})`;
    shareButton.className =
      "bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600 transition duration-200";
    shareButton.addEventListener("click", async () => {
      post.shares++;
      await updatePost(post.id, { shares: post.shares });
      renderUserPosts(userId); // Refresh the gallery to show updated shares
    });

    const commentInput = document.createElement("input");
    commentInput.placeholder = "Add a comment";
    commentInput.className = "border border-gray-300 p-2 rounded w-full mt-2";

    const commentButton = document.createElement("button");
    commentButton.textContent = "Comment";
    commentButton.className =
      "bg-purple-500 text-white p-2 rounded mt-2 hover:bg-purple-600 transition duration-200";
    commentButton.addEventListener("click", async () => {
      const commentText = commentInput.value;
      if (commentText) {
        post.comments.push(commentText);
        await updatePost(post.id, { comments: post.comments });
        renderUserPosts(userId); // Refresh the gallery to show updated comments
      }
    });

    const commentsList = document.createElement("div");
    post.comments.forEach((comment) => {
      const commentElement = document.createElement("p");
      commentElement.textContent = comment;
      commentElement.className = "text-gray-600 mt-1";
      commentsList.appendChild(commentElement);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className =
      "bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600 transition duration-200";
    deleteButton.addEventListener("click", async () => {
      await deletePost(post.id);
      renderUserPosts(userId); // Refresh the gallery after deletion
    });

    postElement.appendChild(imgElement);
    postElement.appendChild(likeButton);
    postElement.appendChild(shareButton);
    postElement.appendChild(commentInput);
    postElement.appendChild(commentButton);
    postElement.appendChild(commentsList);
    postElement.appendChild(deleteButton);
    gallery.appendChild(postElement);
  });
}
