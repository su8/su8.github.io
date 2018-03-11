const nothingFoundTemplate = empty => `
    <hr>
      <div class='alert alert-info'>Nothing found.</div>
    <hr>
`;
const searchTemplate = arr => `
    ${arr.map(el => `
       <div class='page-header'>
         <h4>
           <a href='${el[1]}' class='text-muted'>
               ${el[0]}
           </a>
         </h4>
       </div>
     `).join('')
    }
`;
const entries = [
    //  title     url
    ['Lorem', 'http://ex0.com'],
    ['Little Joe', 'http://ex1.com'],
    ['ipsum', 'http://ex2.com'],
    ['next', 'http://ex3.com'],
    ['generation', 'http://ex4.com'],
    ['old', 'http://ex5.com'],
    ['school', 'http://ex6.com']
];

const innerData = (template, data, id) => {
    const div = document.createElement('div'),
        container = document.querySelector(`#${id}`);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    div.innerHTML = template(data);
    container.appendChild(div);
};
const invokeSearch = () => {
    let arr = [],
        foundPosts = false,
        uzerQuery = document.getElementById('uzer-infut')
          .value.toLowerCase();

    if (!uzerQuery) {
        innerData(nothingFoundTemplate, arr, 'queryMe');
        return false;
    }

    entries.forEach(entry => {
        if (entry[0].toLowerCase().match(uzerQuery)) {
            arr.push(entry);
            foundPosts = true;
        }
    });
    innerData(foundPosts ? searchTemplate :
            nothingFoundTemplate, arr, 'queryMe');
};
document.getElementById('uzer-infut')
  .addEventListener('input', invokeSearch, false);
