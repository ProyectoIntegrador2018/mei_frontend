const printPDFButton = document.getElementById('print-pdf');

printPDFButton.addEventListener('click', function(event){
  window.print();
});