let indiceEdicaoProfessor = null;

document.addEventListener("DOMContentLoaded", () => {
    const softwareForm = document.getElementById("software-form");
    const solicitacaoForm = document.getElementById("solicitacao-form");
    const professorForm = document.getElementById("professor-form");
    const softwareSelect = document.getElementById("software");
    const lista = document.getElementById("lista-softwares");
    const paginaAtual = window.location.pathname.split("/").pop(); // pega só o nome do arquivo
    const isAdminPage = paginaAtual === "admin-lista.html";
    const listaSolicitacoes = document.getElementById("lista-solicitacoes");
    const listaProfessores = document.getElementById("lista-professores");
    const professorSelect = document.getElementById("professor");
    let softwares = JSON.parse(localStorage.getItem("softwares")) || [];
    const professores = JSON.parse(localStorage.getItem("professores")) || [];

    atualizarLista(); //atualiza a lista que mostra os professores cadastrados

    //permite excluir o software desejado
    
    if (lista) {
        lista.addEventListener("click", (e) => {
            const target = e.target;
    
            // Botão de excluir
            if (target.classList.contains("excluir")) {
                const index = parseInt(target.dataset.index);
                excluirSoftware(index);
            }
    
            // Botão de editar
            if (target.classList.contains("editar")) {
                const index = parseInt(target.dataset.index);
                window.location.href = `admin-cadastro.html?editar=${index}`;
            }
    
            // Botão de indisponível
            if (target.classList.contains("indisponivel")) {
                const index = parseInt(target.dataset.index);
                marcarIndisponivel(index);
            }
        });
        
    }
    

    // Preenche o select de software na solicitação
    if (softwareSelect) {
        softwareSelect.innerHTML = softwares.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    }

    // Mostra softwares disponíveis na lista
    if (lista) {
    const softwaresDisponiveis = softwares.filter(s => s.disponivel !== false);
    lista.innerHTML = '';

    // Botões de editar, excluir e marcar indisponível apenas na página de admin
    softwaresDisponiveis.forEach((soft, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${soft.nome}</strong> — Versão: ${soft.versao} — Tipo: ${soft.tipo}
            ${isAdminPage ? `
                <button onclick="window.location.href='admin-cadastro.html?editar=${index}'">Editar</button>
                <button class="excluir" data-index="${index}">Excluir</button>
                <button class="indisponivel" data-index="${index}">Indisponível</button>` : ''}`;
        lista.appendChild(li);
        
    });
    
}


    // Cadastro e edição de Software
    if (softwareForm) {
        softwareForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome").value;
            const link = document.getElementById("link").value;
            const versao = document.getElementById("versao").value;
            const tipo = document.getElementById("tipo").value;
            const data = document.getElementById("data").value;
            const indexEdicao = document.getElementById("index-edicao").value;

            const novoSoftware = { nome, link, versao, tipo, data, disponivel: true };

            if (indexEdicao === "") {
                // Novo cadastro
                softwares.push(novoSoftware);
                document.getElementById("mensagem").innerText = "Software cadastrado com sucesso!";
            } else {
                // Atualização de software
                softwares[indexEdicao] = novoSoftware;
                document.getElementById("mensagem").innerText = "Software atualizado com sucesso!";
                document.getElementById("index-edicao").value = "";
                document.querySelector("button[type='submit']").textContent = "Cadastrar";
            }

            localStorage.setItem("softwares", JSON.stringify(softwares));
            softwareForm.reset();
        });

        // Verifica se a página tem parâmetro ?editar e preenche o formulário
        const params = new URLSearchParams(window.location.search);
        if (params.has("editar")) {
            const index = params.get("editar");
            const softwares = JSON.parse(localStorage.getItem("softwares")) || [];
            const software = softwares[index];
        
        if (software) {
            document.getElementById("nome").value = software.nome;
            document.getElementById("link").value = software.link;
            document.getElementById("versao").value = software.versao;
            document.getElementById("tipo").value = software.tipo;
            document.getElementById("data").value = software.data;
            document.getElementById("index-edicao").value = index;

        const botao = document.querySelector("#software-form button[type='submit']");
        if (botao) {
            botao.textContent = "Atualizar";
        }
    }
}

    }

    // Solicitação de instalação
    if (solicitacaoForm) {
        solicitacaoForm.addEventListener("submit", (e) => {
            e.preventDefault();
    
            const professor = document.getElementById("professor").value;
            const software = document.getElementById("software").value;
            const laboratorio = document.getElementById("laboratorio").value;
            const data = document.getElementById("data").value;
    
            const novaSolicitacao = { professor, software, laboratorio, data };
    
            // Recupera solicitações anteriores (ou array vazio)
            const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
    
            // Adiciona a nova
            solicitacoes.push(novaSolicitacao);
    
            // Salva de volta
            localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
    
            console.log("Solicitação registrada:", novaSolicitacao);
            document.getElementById("mensagem-solicitacao").innerText = "Solicitação registrada com sucesso!";
            solicitacaoForm.reset();
        });
    }
    

    // Cadastro de Professor
    if (professorForm) {
        professorForm.addEventListener("submit", (e) => {
            e.preventDefault();
    
            const nome = document.getElementById("nome-prof").value.trim();
            const escola = document.getElementById("escola").value.trim();
            const mensagem = document.getElementById("mensagem-professor");
            let professores = JSON.parse(localStorage.getItem("professores")) || [];
    
            if (!nome || !escola) {
                mensagem.innerText = "Preencha todos os campos.";
                mensagem.style.color = "red";
                return;
            }
    
            if (indiceEdicaoProfessor !== null) {
                // Atualizar professor existente
                professores[indiceEdicaoProfessor] = { nome, escola };
                indiceEdicaoProfessor = null; // Reseta o índice
                mensagem.innerText = "Professor atualizado com sucesso!";
                document.querySelector("#professor-form button[type='submit']").textContent = "Cadastrar";
            } else {
                // Novo cadastro
                professores.push({ nome, escola });
                mensagem.innerText = "Professor cadastrado com sucesso!";
            }
    
            localStorage.setItem("professores", JSON.stringify(professores));
            professorForm.reset();
    
            atualizarLista(); // Função para atualizar visualmente a lista
        });
    }
            professores.push({ nome, escola });
            localStorage.setItem("professores", JSON.stringify(professores));

            mensagem.innerText = "Professor cadastrado com sucesso!";
            professorForm.reset();
        });

        // Exibir lista de softwares na página admin-lista.html
        const listaAdmin = document.getElementById("lista-softwares");
        if (listaAdmin) {
            listaAdmin.innerHTML = '';
            softwares.forEach((soft, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${soft.nome}</strong> — Versão: ${soft.versao} — Tipo: ${soft.tipo} — Data: ${soft.data}
                    <button onclick="editarSoftware(${index})">Editar</button>
                    <button onclick="excluirSoftware(${index})">Excluir</button>
                    <button onclick="marcarIndisponivel(${index})">Indisponível</button>
                `;
                listaAdmin.appendChild(li);
            });
            
        }

        const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

    const tabelaSolicitacoes = document.getElementById("lista-solicitacoes");

    if (tabelaSolicitacoes) {
        if (solicitacoes.length === 0) {
            const linha = document.createElement("tr");
            linha.innerHTML = "<td colspan='4'>Nenhuma solicitação encontrada.</td>";
            tabelaSolicitacoes.appendChild(linha);
        } else {
            solicitacoes.forEach(solicitacao => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${solicitacao.professor || 'N/A'}</td>
                    <td>${solicitacao.software}</td>
                    <td>${solicitacao.laboratorio}</td>
                    <td>${solicitacao.data}</td>
                `;
                tabelaSolicitacoes.appendChild(linha);
            });
        }
    }

    //Selecionar professor
    if (professorSelect) {
    professores.forEach((prof) => {
        const option = document.createElement("option");
        option.value = prof.nome;
        option.text = prof.nome;
        professorSelect.add(option);
    });
}

    // Preenche o select de software (sem duplicar)
if (softwareSelect) {
    softwareSelect.innerHTML = ""; // evita duplicações

    softwares.forEach((soft) => {
        const option = document.createElement("option");
        option.value = soft.nome;
        option.text = soft.nome;
        softwareSelect.add(option);
    });
}
    // Exibir lista de professores na página admin-lista.html

    if (listaProfessores) {
        listaProfessores.innerHTML = '';
        professores.forEach((prof, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${prof.nome} — Escola: ${prof.escola}
                <button onclick="editarProfessor(${index})">Editar</button>
                <button onclick="excluirProfessor(${index})">Excluir</button>
            `;
            listaProfessores.appendChild(li);
        });
    }    
//botoes de excluir e editar
function excluirProfessor(index) {
    const professores = JSON.parse(localStorage.getItem("professores")) || [];
    professores.splice(index, 1);
    localStorage.setItem("professores", JSON.stringify(professores));
    location.reload(); // Recarrega para atualizar a lista
}

function editarProfessor(index) {
    const professores = JSON.parse(localStorage.getItem("professores")) || [];
    const prof = professores[index];

    document.getElementById("nome-prof").value = prof.nome;
    document.getElementById("escola").value = prof.escola;

    // Define o índice que está sendo editado
    indiceEdicaoProfessor = index;

    // Atualiza o texto do botão para "Atualizar"
    document.querySelector("#professor-form button[type='submit']").textContent = "Atualizar";
}
//lista professores cadastrados
function atualizarLista() {
    const listaProfessores = document.getElementById("lista-professores");
    const professores = JSON.parse(localStorage.getItem("professores")) || [];

    if (!listaProfessores) return;

    listaProfessores.innerHTML = '';
    professores.forEach((prof, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${prof.nome} — Escola: ${prof.escola}
            <button onclick="editarProfessor(${index})">Editar</button>
            <button onclick="excluirProfessor(${index})">Excluir</button>
        `;
        listaProfessores.appendChild(li);
    });
}
function excluirSoftware(index) {
    const softwares = JSON.parse(localStorage.getItem("softwares")) || [];

    if (confirm("Tem certeza que deseja excluir este software?")) {
        softwares.splice(index, 1);
        localStorage.setItem("softwares", JSON.stringify(softwares));
        location.reload();
    }
}

// Área de login
function acessarComo(perfil) {
    if (perfil === 'professor') {
        window.location.href = 'professor.html';
    } else if (perfil === 'admin') {
        window.location.href = 'admin.html';
    }
}
