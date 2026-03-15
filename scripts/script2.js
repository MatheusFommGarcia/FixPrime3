// script.js

// Dados simulados do carrinho
const cartData = {
  items: [
    {
      id: 1,
      name: "Cimento Portland 50kg",
      variant: "Tipo CP II",
      price: 32.90,
      quantity: 5,
      image: "https://images.unsplash.com/photo-1590644365607-1c5a0e1c5c5c?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      name: "Tijolo Cerâmico 8 Furos",
      variant: "Milheiro",
      price: 450.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      name: "Areia Média Lavada",
      variant: "Metro cúbico",
      price: 85.00,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=150&h=150&fit=crop"
    }
  ],
  frete: 45.00
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa ícones do Lucide
  lucide.createIcons();
  
  // Renderiza itens do pedido
  renderOrderItems();
  
  // Atualiza totais
  updateTotals();
  
  // Configura máscaras de input
  setupInputMasks();
  
  // Configura eventos de pagamento
  setupPaymentEvents();
  
  // Configura botão finalizar
  setupCheckoutButton();
});

// Renderiza itens do pedido
function renderOrderItems() {
  const container = document.getElementById('order-items');
  
  if (!container) return;
  
  const html = cartData.items.map(item => `
    <div class="order-item">
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-variant">${item.variant} • Qtd: ${item.quantity}</div>
        <div class="item-price">R$ ${formatPrice(item.price * item.quantity)}</div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// Atualiza totais
function updateTotals() {
  const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + cartData.frete;
  
  document.getElementById('subtotal').textContent = `R$ ${formatPrice(subtotal)}`;
  document.getElementById('frete').textContent = `R$ ${formatPrice(cartData.frete)}`;
  document.getElementById('total').textContent = `R$ ${formatPrice(total)}`;
  
  // Atualiza opções de parcelamento
  updateParcelas(total);
}

// Atualiza opções de parcelamento
function updateParcelas(total) {
  const select = document.getElementById('parcelas');
  if (!select) return;
  
  const options = [];
  for (let i = 1; i <= 12; i++) {
    const valor = total / i;
    const texto = i === 1 
      ? `1x de R$ ${formatPrice(valor)} (à vista)`
      : `${i}x de R$ ${formatPrice(valor)}`;
    options.push(`<option value="${i}">${texto}</option>`);
  }
  
  select.innerHTML = options.join('');
}

// Configura máscaras de input
function setupInputMasks() {
  // Telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      }
      
      e.target.value = value;
    });
  }
  
  // CPF
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      value = value.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
      value = value.replace(/^(\d{3})(\d{3})$/, '$1.$2');
      value = value.replace(/^(\d{3})$/, '$1');
      
      e.target.value = value;
    });
  }
  
  // Número do cartão
  const numeroCartao = document.getElementById('numero-cartao');
  if (numeroCartao) {
    numeroCartao.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);
      
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = value;
    });
  }
  
  // Validade
  const validade = document.getElementById('validade');
  if (validade) {
    validade.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      
      if (value.length >= 2) {
        value = value.replace(/^(\d{2})(\d{0,2})$/, '$1/$2');
      }
      
      e.target.value = value;
    });
  }
  
  // CVV
  const cvv = document.getElementById('cvv');
  if (cvv) {
    cvv.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      e.target.value = value;
    });
  }
}

// Configura eventos de pagamento
function setupPaymentEvents() {
  const paymentOptions = document.querySelectorAll('input[name="payment"]');
  const cartaoForm = document.getElementById('cartao-form');
  
  paymentOptions.forEach(option => {
    option.addEventListener('change', function() {
      if (this.value === 'cartao') {
        cartaoForm.classList.remove('hidden');
        // Foca no primeiro campo do cartão
        setTimeout(() => {
          document.getElementById('numero-cartao')?.focus();
        }, 100);
      } else {
        cartaoForm.classList.add('hidden');
      }
    });
  });
}

// Configura botão de checkout
function setupCheckoutButton() {
  const btn = document.getElementById('btn-finalizar');
  if (!btn) return;
  
  btn.addEventListener('click', function() {
    if (validateForm()) {
      processPayment();
    }
  });
}

// Valida formulário
function validateForm() {
  const requiredFields = ['nome', 'email', 'telefone', 'cpf'];
  let isValid = true;
  let firstError = null;
  
  // Limpa erros anteriores
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });
  
  // Valida campos obrigatórios
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    const group = field?.closest('.form-group');
    
    if (!field || !field.value.trim()) {
      isValid = false;
      if (group) {
        group.classList.add('error');
        group.style.borderColor = 'var(--primary)';
      }
      if (!firstError) firstError = field;
    }
  });
  
  // Valida email
  const email = document.getElementById('email');
  if (email && email.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      isValid = false;
      email.closest('.form-group')?.classList.add('error');
      if (!firstError) firstError = email;
    }
  }
  
  // Valida campos do cartão se selecionado
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  if (paymentMethod === 'cartao') {
    const cartaoFields = ['numero-cartao', 'validade', 'cvv', 'nome-cartao'];
    cartaoFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        isValid = false;
        field?.closest('.form-group')?.classList.add('error');
        if (!firstError) firstError = field;
      }
    });
  }
  
  if (firstError) {
    firstError.focus();
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  return isValid;
}

// Processa pagamento
function processPayment() {
  const btn = document.getElementById('btn-finalizar');
  const originalText = btn.innerHTML;
  
  // Desabilita botão e mostra loading
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" class="icon-sm animate-spin"></i> Processando...`;
  lucide.createIcons();
  
  // Simula processamento
  setTimeout(() => {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (paymentMethod === 'pix') {
      showPixModal();
    } else {
      showSuccessMessage();
    }
    
    // Restaura botão
    btn.disabled = false;
    btn.innerHTML = originalText;
    lucide.createIcons();
  }, 2000);
}

// Mostra modal do PIX
function showPixModal() {
  const total = document.getElementById('total').textContent;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Pagamento via PIX</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="pix-qr">
          <div class="qr-placeholder">
            <i data-lucide="qr-code" style="width: 64px; height: 64px; color: var(--foreground-muted);"></i>
          </div>
          <p class="pix-instructions">Escaneie o QR Code com seu aplicativo bancário</p>
        </div>
        <div class="pix-code">
          <p>Código PIX:</p>
          <div class="code-box">
            <code>00020126580014BR.GOV.BCB.PIX0136fixprime@email.com520400005303986540${total.replace(/\D/g, '')}5802BR5913Fix Prime6009SAO PAULO62070503***6304</code>
            <button class="btn-copy" onclick="copyPixCode(this)">
              <i data-lucide="copy" class="icon-sm"></i>
              Copiar
            </button>
          </div>
        </div>
        <div class="pix-timer">
          <i data-lucide="clock" class="icon-sm"></i>
          <span>Expira em 30:00</span>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  lucide.createIcons();
  
  // Adiciona estilos do modal se não existirem
  if (!document.getElementById('modal-styles')) {
    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        padding: 1rem;
        animation: fadeIn 0.2s;
      }
      
      .modal-content {
        background: var(--background-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        width: 100%;
        max-width: 420px;
        animation: slideUp 0.3s;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border);
      }
      
      .modal-header h3 {
        font-size: 1.125rem;
        font-weight: 600;
      }
      
      .modal-close {
        background: none;
        border: none;
        color: var(--foreground-muted);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        transition: all 0.2s;
      }
      
      .modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--foreground);
      }
      
      .modal-body {
        padding: 1.5rem;
      }
      
      .pix-qr {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      
      .qr-placeholder {
        width: 200px;
        height: 200px;
        margin: 0 auto 1rem;
        background: white;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .pix-instructions {
        color: var(--foreground-muted);
        font-size: 0.875rem;
      }
      
      .pix-code {
        margin-bottom: 1.5rem;
      }
      
      .pix-code p {
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        color: var(--foreground-muted);
      }
      
      .code-box {
        display: flex;
        gap: 0.5rem;
        align-items: stretch;
      }
      
      .code-box code {
        flex: 1;
        background: var(--background);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        font-size: 0.75rem;
        word-break: break-all;
        color: var(--foreground-muted);
      }
      
      .btn-copy {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.75rem;
        background: var(--background);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--foreground);
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 64px;
      }
      
      .btn-copy:hover {
        border-color: var(--primary);
        color: var(--primary);
      }
      
      .btn-copy.copied {
        border-color: var(--success);
        color: var(--success);
      }
      
      .pix-timer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        background: var(--orange-light);
        border-radius: var(--radius-sm);
        color: var(--primary);
        font-weight: 500;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styles);
  }
}

// Copia código PIX
function copyPixCode(btn) {
  const code = btn.previousElementSibling.textContent;
  navigator.clipboard.writeText(code).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="icon-sm"></i>Copiado`;
    btn.classList.add('copied');
    lucide.createIcons();
    
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('copied');
      lucide.createIcons();
    }, 2000);
  });
}

// Mostra mensagem de sucesso
function showSuccessMessage() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content" style="text-align: center; padding: 2rem;">
      <div style="width: 64px; height: 64px; background: var(--success-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
        <i data-lucide="check" style="width: 32px; height: 32px; color: var(--success);"></i>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Pagamento Aprovado!</h3>
      <p style="color: var(--foreground-muted); margin-bottom: 1.5rem;">Seu pedido foi processado com sucesso. Você receberá um e-mail com os detalhes.</p>
      <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()" style="padding: 0.75rem 2rem;">
        Continuar
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  lucide.createIcons();
}

// Formata preço
function formatPrice(value) {
  return value.toFixed(2).replace('.', ',');
}

// Adiciona estilos de erro dinamicamente
const errorStyles = document.createElement('style');
errorStyles.textContent = `
  .form-group.error input {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
  }
  
  .form-group.error label {
    color: #ef4444 !important;
  }
`;
document.head.appendChild(errorStyles);