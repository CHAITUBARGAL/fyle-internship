const baseURL = 'https://api.github.com/users/';
const perPage = 10; // Default items per page

function getRepositories() {
    const username = document.getElementById('username').value;
    const userContainer = document.getElementById('user-details');
    const repositoriesContainer = document.getElementById('repositories');
    const paginationContainer = document.getElementById('pagination');
    const loader = document.getElementById('loader');

    loader.style.display = 'block';

    // Fetch user details from GitHub API
    fetch(baseURL + username)
        .then(response => response.json())
        .then(user => {
            displayUserDetails(user, userContainer);
            // Fetch repositories after getting user details
            return fetch(baseURL + username + '/repos?per_page=' + perPage);
        })
        .then(response => response.json())
        .then(repositories => {
            loader.style.display = 'none';
            displayRepositories(repositories, repositoriesContainer);
            generatePagination(repositories.length);
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error fetching data:', error);
        });
}

function displayUserDetails(user, container) {
    container.innerHTML = ''; // Clear previous content

    const userElement = document.createElement('div');
    userElement.className = 'user-details';
    userElement.innerHTML = `
        <img src="${user.avatar_url}" alt="Profile Picture" class="profile-picture">
        <h2>${user.name || user.login}</h2>
        <p>Location: ${user.location || 'Not specified'}</p>
        <p>Twitter: <a href="https://twitter.com/${user.twitter_username}" target="_blank">${user.twitter_username || 'Not specified'}</a></p>
        <p>GitHub: <a href="${user.html_url}" target="_blank">${user.login}</a></p>
    `;
    container.appendChild(userElement);
}

function displayRepositories(repositories, container) {
    container.innerHTML = ''; // Clear previous content

    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repository';
        repoElement.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available'}</p>
            <p>Language: ${repo.language || 'Not specified'}</p>
            <p>Topics: ${repo.topics.join(', ') || 'No topics'}</p>
        `;
        container.appendChild(repoElement);
    });
}

function generatePagination(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    const totalPages = Math.ceil(totalItems / perPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            changePage(i);
        });
        paginationContainer.appendChild(pageButton);
    }
}

function changePage(pageNumber) {
    const username = document.getElementById('username').value;
    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');

    loader.style.display = 'block';

    const offset = (pageNumber - 1) * perPage;

    // Fetch repositories for the selected page
    fetch(baseURL + username + `/repos?per_page=${perPage}&page=${pageNumber}`)
        .then(response => response.json())
        .then(repositories => {
            loader.style.display = 'none';
            displayRepositories(repositories, repositoriesContainer);
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error fetching repositories:', error);
        });
}

// Initial call to get repositories when the page loads
getRepositories();
