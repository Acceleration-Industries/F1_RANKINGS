document.addEventListener("DOMContentLoaded", function () {
    const fetchData = async (season, round) => {
        try {
            const response = await axios.get(`http://ergast.com/api/f1/${season}/${round}/driverstandings.json`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const populateYearDropdown = () => {
        const currentYear = new Date().getFullYear();
        const dropdownContent = document.querySelector('.year-dropdown-content');
        dropdownContent.innerHTML = '';
        for (let year = 1950; year <= currentYear; year++) {
            const option = document.createElement('div');
            option.textContent = year;
            option.classList.add('dropdown-option');
            option.addEventListener('click', async () => {
                document.querySelector('.dropdown-header').textContent = year;
                populateRaceDropdown(year);
            });
            dropdownContent.appendChild(option);
        }
    };

    const populateRaceDropdown = async (year) => {
        try {
            const response = await axios.get(`http://ergast.com/api/f1/${year}.json`);
            const races = response.data?.MRData?.RaceTable?.Races || [];
            const dropdownContent = document.querySelector('.race-dropdown-content');
            dropdownContent.innerHTML = '';
            races.forEach(race => {
                const option = document.createElement('div');
                option.textContent = race.raceName;
                option.classList.add('dropdown-option');
                option.addEventListener('click', async () => {
                    const season = race.season;
                    const round = race.round;
                    const data = await fetchData(season, round);
                    populateTable(data);
                    document.getElementById('modal').style.display = 'block';
                });
                dropdownContent.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching races:', error);
        }
    };

    const populateTable = (data) => {
        const table = document.getElementById('f1-table');
        table.innerHTML = ''; 
        data?.MRData?.StandingsTable?.StandingsLists?.forEach(list => {
            list.DriverStandings.forEach(driver => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${driver.position}</td>
                    <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                    <td>${driver.points}</td>
                    <td>${driver.wins}</td>
                    <td>${driver.Driver.nationality}</td>
                    <td>${driver.Constructors[0].name}</td>
                `;
                table.appendChild(row);
            });
        });
    };

    const closeModal = () => {
        document.getElementById('modal').style.display = 'none';
    };

    document.querySelector('.close').addEventListener('click', closeModal);

    document.querySelector('.change').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const modeText = document.querySelector('.change');
        modeText.textContent = document.body.classList.contains('dark-mode') ? 'LIGHT MODE' : 'DARK MODE';
    });

    populateYearDropdown();
});
