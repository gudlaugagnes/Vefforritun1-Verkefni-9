const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies;
  let result;

  function searchLoading() {
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }

    const load = document.createElement('div');
    load.classList.add('loading');

    const loadGif = document.createElement('img');
    loadGif.src = 'loading.gif';

    const loadText = document.createElement('p');
    loadText.innerHTML = 'Leita að fyrirtækjum...';

    load.appendChild(loadGif);
    load.appendChild(loadText);
    result.appendChild(load);
  }

  function displayError(error) {
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }
    result.appendChild(document.createTextNode(error));
  }


  function companiesGetter(companyList) {
    companyList.forEach((obj) => {
      const companyEl = document.createElement('div');
      companyEl.classList.add('company');
      const listEl = document.createElement('dl');

      const nameTerm = document.createElement('dt');
      listEl.appendChild(nameTerm);

      const nameData = document.createElement('dd');
      listEl.appendChild(nameData);

      const snTerm = document.createElement('dt');
      listEl.appendChild(snTerm);

      const snData = document.createElement('dd');
      listEl.appendChild(snData);

      nameTerm.innerHTML = 'Nafn:';
      snTerm.innerHTML = 'Kennitala:';
      nameData.innerHTML = obj.name;
      snData.innerHTML = obj.sn;

      if (obj.active === 1) {
        companyEl.classList.add('company--active');
        const addrTerm = document.createElement('dt');
        addrTerm.innerHTML = 'Heimilisfang:';
        listEl.appendChild(addrTerm);
        const addrData = document.createElement('dd');
        addrData.innerHTML = obj.address;
        listEl.appendChild(addrData);
      } else {
        companyEl.classList.add('company--inactive');
      }
      companyEl.appendChild(listEl);
      result.appendChild(companyEl);
    });
  }


  function displayCompanies(companyList) {
    if (companyList.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng.');
      return;
    }

    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }
    companiesGetter(companyList);
  }

  function getData(company) {
    fetch(API_URL + company)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa.');
      })
      .then((data) => {
        displayCompanies(data.results);
      })
      .catch(() => {
        displayError('Villa við að sækja gögn.');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    searchLoading();
    const input = companies.querySelector('form').querySelector('input');
    if (input.value.length === 0) {
      displayError('Lén verður að vera strengur.');
    } else {
      getData(input.value);
    }
  }


  function init(_companies) {
    companies = _companies;
    result = companies.querySelector('.results');
    const form = companies.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }


  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');
  program.init(companies);
});
