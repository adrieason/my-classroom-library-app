
console.log('yes i am linked')
//Listening for a person to click button. Once it's clicked the text from the text box is input in the getText function 

document.getElementById('isbnbutton').addEventListener('click', getText)

function getText (){ //this is the getText function that runs on click 

    let isbn = document.getElementById('isbninput').value //isbn of book teacher is trying to

fetch(`https://openlibrary.org/isbn/${isbn}.json`) 

    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      document.getElementById('title').innerText = data.title
      let author = data.authors[0].key
      console.log(author)
      document.getElementById('coverisbn').innerHTML = `<img src="https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg">`

      fetch(`https://openlibrary.org${author}.json`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data.name)
        document.getElementById('author').innerText = data.name
      })
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
  }