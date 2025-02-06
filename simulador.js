const _elements = {
  runnersList: () => document.querySelector('.runners-list'),
  startRaceButton: () => document.getElementById('start-race'),
  trackList: () => document.getElementById('track-list'),
  trackListButton: () => document.querySelector('.track-list-btn'),
  trackListContainer: () => document.querySelector('.track-list-container'),
};

async function getData() {
  try {
    const trackOptions = await fetch(
      'https://gustavobuttenbender.github.io/gus.github/corrida-maluca/pistas.json'
    ).then((res) => res.json());
    const runnerOptions = await fetch(
      'https://gustavobuttenbender.github.io/gus.github/corrida-maluca/personagens.json'
    ).then((res) => res.json());

    return {
      trackOptions,
      runnerOptions,
    };
  } catch (error) {
    console.error(`Error getting data: ${error.message}`);
  }
}

function populateTracks(trackOptions, updateSelection) {
  trackOptions.forEach((track) => {
    const trackItem = document.createElement('a');
    trackItem.dataset.id = track.id;
    trackItem.classList.add('track-option');
    trackItem.textContent = track.nome;

    trackItem.addEventListener('click', () => {
      trackItem.classList.add('selected');

      document.querySelectorAll('.track-option').forEach((item) => {
        item.classList.remove('selected');
      });

      _elements.trackListButton().classList.add('selected');
      _elements.trackListButton().textContent = track.nome;
      _elements.trackListContainer().classList.remove('show');

      updateSelection({ track });
    });

    _elements.trackList().appendChild(trackItem);
  });
}

function populateRunners(runnerOptions, updateSelection) {
  runnerOptions.forEach((runner) => {
    const runnerButton = document.createElement('button');
    runnerButton.classList.add('runner-button');
    runnerButton.dataset.id = runner.id;
    runnerButton.textContent = runner.nome;

    runnerButton.addEventListener('click', () => {
      runnerButton.classList.toggle('selected');
      updateSelection({ runner });
    });

    _elements.runnersList().appendChild(runnerButton);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const { trackOptions, runnerOptions } = await getData();

  let selectedTrack = null;
  let selectedRunners = [];

  _elements.startRaceButton().addEventListener('click', () => {
    if (selectedTrack && selectedRunners.length >= 2) {
      const winner = window.corridaMaluca(
        selectedTrack,
        runnerOptions.filter((runner) => selectedRunners.includes(runner.id))
      );

      alert(`O vencedor da corrida é: ${winner.nome}`);

      window.location.reload();
    }
  });

  _elements.trackListButton().addEventListener('click', (e) => {
    e.stopPropagation();
    _elements.trackListContainer().classList.toggle('show');
  });

  document.addEventListener('click', () => {
    _elements.trackListContainer().classList.remove('show');
  });

  function updateSelection({ track, runner }) {
    selectedTrack = track || selectedTrack;

    if (runner) {
      const isSelected = selectedRunners.includes(runner.id);
      if (isSelected) {
        selectedRunners = selectedRunners.filter((id) => id !== runner.id);
      } else {
        selectedRunners.push(runner.id);
      }
    }

    _elements.startRaceButton().disabled = !(
      selectedTrack && selectedRunners.length >= 2
    );
  }

  populateTracks(trackOptions, updateSelection);
  populateRunners(runnerOptions, updateSelection);
});
