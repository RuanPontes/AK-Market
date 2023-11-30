document.addEventListener('DOMContentLoaded', function () {
    var items = window.items || [];
    var itemList = document.getElementById('item-list');
    var cartList = document.getElementById('cart-list');
    var searchInput = document.querySelector('.search-bar-container input');

    var currentPage = 1;
    var itemsPerPage = 6;

    function displayItems(itemsToDisplay) {
        itemList.innerHTML = "";

        for (var i = 0; i < itemsToDisplay.length; i++) {
            var item = itemsToDisplay[i];

            var cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <div class="card-body">
                    <div class="item-header">
                    <h5 class="card-title uppercase">${item.name}</h5>
                    <img src="${item.icon}" alt="${item.name} Icon" class="card-icon-right">
                    </div>
                    <p class="card-text">Add: ${item.add}</p>
                    <p class="card-text">Vendedor: ${item.seller}</p>
                    <p class="card-text"> 🪙 <span class="price-highlight">${item.price}</span> 🪙 </p>
                    <button class="btn btn-primary add-to-cart" data-name="${item.name}" data-seller="${item.seller}" data-price="${item.price}" data-whatsapp="${item.whatsapp}" data-icon="${item.icon}">🛒 Adicionar ao carrinho</button>
                </div>
            `;

            itemList.appendChild(cardElement);
        }
    }

    // Função para filtrar os itens com base na pesquisa
    function filterItems(searchTerm) {
        var filteredItems = items.filter(function (item) {
            return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.add.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.seller.toLowerCase().includes(searchTerm.toLowerCase());
        });
        return filteredItems;
    }

    // Função para atualizar a página
    function updatePage() {
        var searchTerm = searchInput.value;
        var filteredItems = filterItems(searchTerm);
        displayItems(getItemsForCurrentPage(filteredItems));
        updatePagination(filteredItems.length);

        // Adicione um SweetAlert apenas se houver itens na busca
        if (searchTerm !== '' && filteredItems.length > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Busca Concluída',
                text: 'Os itens foram filtrados com base na sua pesquisa.',
                timer: 2000,
                showConfirmButton: false
            });
        } else if (searchTerm !== '' && filteredItems.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Nenhum Item Encontrado',
                text: 'Nenhum item corresponde à sua pesquisa.',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }

    // Evento de pressionar a tecla Enter na barra de pesquisa
    searchInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            updatePage();
        }
    });

    function setupPagination(totalItems) {
        var totalPages = Math.ceil(totalItems / itemsPerPage);
        var prevBtn = document.getElementById('prev-btn');
        var nextBtn = document.getElementById('next-btn');

        prevBtn.addEventListener('click', function (event) {
            event.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                updatePage();
            }
        });

        nextBtn.addEventListener('click', function (event) {
            event.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });

        updatePage();
    }

    function updatePagination(totalItems) {
        var totalPages = Math.ceil(totalItems / itemsPerPage);
        var prevBtn = document.getElementById('prev-btn');
        var nextBtn = document.getElementById('next-btn');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function getItemsForCurrentPage(filteredItems) {
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        return filteredItems.slice(startIndex, endIndex);
    }

    setupPagination(items.length);

    itemList.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart')) {
            var itemName = event.target.dataset.name;
            var selectedItem = items.find(item => item.name === itemName);
            addToCart(selectedItem, event);
        }
    });



    function addToCart(item, event) {
        console.log(item); // Adicione esta linha
    
        var cartItems = document.querySelectorAll('#cart-list tr');
    
        if (cartItems.length > 0) {
            var newItemSeller = item.seller.toLowerCase().trim();
            var cartSellerCell = cartItems[cartItems.length - 1].querySelector('td:nth-child(2)');
            var cartSeller = cartSellerCell ? cartSellerCell.textContent.toLowerCase().trim() : null;
    
            if (cartSeller && newItemSeller && cartSeller !== newItemSeller) {
                console.log('Showing SweetAlert for different sellers');
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção!',
                    html: `Você adicionou um item do vendedor <strong>${cartSeller}</strong> e agora está adicionando um item do vendedor <strong>${newItemSeller}</strong>.`,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } else {
                console.log('Adding to cart for the same seller');
                addToCartInternal(item, event);
            }
        } else {
            console.log('Adding to cart for the first item');
            addToCartInternal(item, event);
        }
    }
    
    function addToCartInternal(item, event) {
        Swal.fire({
            icon: 'success',
            title: 'Item Adicionado!',
            text: `${item.name} foi adicionado ao carrinho.`,
            showConfirmButton: false,
            timer: 1500
        });

        // Restante do código da função addToCartInternal

        var cartList = document.querySelector('#cart-list tbody');
        
        function truncateText(text, limit) {
            var words = text.split(' ');
        
            if(words.length > limit) {
                return words.slice(0, limit).join(' ') + '...';
            }
        
            return text;
        }
        
        var cartItem = document.createElement('tr');
        cartItem.setAttribute('data-whatsapp', item.whatsapp);
        cartItem.innerHTML = `
            <td>
                <div class="icon-text">
                    <img src="${item.icon}" alt="${item.name} Icon" class="product-icon"> <!-- Adicionando o ícone do produto de volta -->
                    ${truncateText(item.name, 2)} <!-- Limitando a 2 palavras -->
                </div>
            </td>
            <td>${truncateText(item.seller, 2)}</td> <!-- Limitando a 2 palavras -->
            <td>${item.price}</td>
            <td><button class="btn btn-danger remove-from-cart" data-name="${item.name}">Remover</button></td>`;
        
        cartList.appendChild(cartItem);
        event.target.disabled = true;
        
        
         

    cartList.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-from-cart')) {
            var itemName = event.target.dataset.name;
            var cartItem = event.target.closest('tr');
            cartItem.remove();

            var addToCartButton = document.querySelector(`.add-to-cart[data-name="${itemName}"]`);
            if (addToCartButton) {
                addToCartButton.disabled = false;
            }
        }
    });

    function formatPhoneNumber(whatsappNumber) {
        var formattedNumber = whatsappNumber.replace(/\D/g, '');
        formattedNumber = '+55' + formattedNumber;
        console.log('Formatted Number:', formattedNumber); // Adicionado console.log aqui
        return formattedNumber;
    }
    
    function sendWhatsappWithItems() {
        var cartItems = document.querySelectorAll('#cart-list tr');
        console.log('Cart items:', cartItems);
    
        if (cartItems.length > 0) {
            var messagesByNumber = {};
    
            cartItems.forEach(function (cartItem) {
                var whatsappNumber = cartItem.getAttribute('data-whatsapp');
    
                if (whatsappNumber) {
                    whatsappNumber = formatPhoneNumber(whatsappNumber);
    
                    var itemName = cartItem.querySelector('td:first-child img').getAttribute('alt');
                    itemName = itemName.replace(' Icon', ''); // Remove a palavra 'Icon'
                    var itemSeller = cartItem.querySelector('td:nth-child(2)').textContent.trim();
                    var itemPriceElement = cartItem.querySelector('td:nth-child(3)');
                    var itemPrice = itemPriceElement.textContent.trim();
    
                    var message = `- ${itemName} (${itemPrice})\n`;
    
                    if (!messagesByNumber[whatsappNumber]) {
                        messagesByNumber[whatsappNumber] = [];
                    }
                    messagesByNumber[whatsappNumber].push(message);
                    console.log('Message:', message);
                }
            });
    
            for (var whatsappNumber in messagesByNumber) {
                if (messagesByNumber.hasOwnProperty(whatsappNumber)) {
                    var messages = messagesByNumber[whatsappNumber];
                    if (messages.length > 0) {
                        var combinedMessage = `Olá, eu tenho interesse nos seguintes itens:\n` + messages.join('');
    
                        var whatsappLink = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(combinedMessage);
                        console.log('Opening Whatsapp with link:', whatsappLink);
                        window.open(whatsappLink, '_blank');
                    }
                }
            }
        } else {
            console.log('No items in the cart.');
        }
    }
    
    var finalizePurchaseButton = document.getElementById('finalize-purchase-button');
    finalizePurchaseButton.addEventListener('click', function () {
        console.log('Finalize purchase button clicked.'); // Adicionado console.log aqui
        sendWhatsappWithItems();
    });

    
    
}})
