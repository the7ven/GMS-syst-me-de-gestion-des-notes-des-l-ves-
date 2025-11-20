// Configuration IndexedDB

let db;
const DB_NAME = 'GradesDB';
const DB_VERSION = 2; // Version mise à jour pour inclure les Object Stores 'classes' et 'students'

// --- FONCTIONS D'INITIALISATION DE CLASSE POUR LE CAMEROUN ---

function getCameroonianDefaultClasses() {
    // Les coefficients sont des valeurs standard qui peuvent être ajustées selon l'école.
    return [
        { 
            name: '6ème', 
            subjects: [
                { name: 'Français', coefficient: 4 },
                { name: 'Anglais', coefficient: 3 },
                { name: 'Mathématiques', coefficient: 4 },
                { name: 'PC (Physique-Chimie)', coefficient: 2 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 2 },
                { name: 'Éducation Civique', coefficient: 1 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        { 
            name: '5ème', 
            subjects: [
                { name: 'Français', coefficient: 4 },
                { name: 'Anglais', coefficient: 3 },
                { name: 'Mathématiques', coefficient: 4 },
                { name: 'PC (Physique-Chimie)', coefficient: 3 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 2 },
                { name: 'Éducation Civique', coefficient: 1 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        { 
            name: '4ème', 
            subjects: [
                { name: 'Français', coefficient: 3 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 5 },
                { name: 'PC (Physique-Chimie)', coefficient: 3 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 3 },
                { name: 'Éducation Civique', coefficient: 1 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        { 
            name: '3ème', 
            subjects: [
                { name: 'Français', coefficient: 3 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 5 },
                { name: 'PC (Physique-Chimie)', coefficient: 4 },
                { name: 'HG (Histoire-Géo)', coefficient: 3 },
                { name: 'SVT (Sciences)', coefficient: 3 },
                { name: 'Éducation Civique', coefficient: 1 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        // 2nd Cycle - Seconde
        { 
            name: '2nde C', // Scientifique 
            subjects: [
                { name: 'Français', coefficient: 3 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 7 },
                { name: 'PC (Physique-Chimie)', coefficient: 6 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 4 },
                { name: 'Éducation Civique', coefficient: 1 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        { 
            name: '2nde D', // Scientifique/Biologie
            subjects: [
                { name: 'Français', coefficient: 3 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 6 },
                { name: 'PC (Physique-Chimie)', coefficient: 5 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 5 },
                { name: 'Éducation Civique', coefficient: 1 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        // 2nd Cycle - Première
        { 
            name: '1ère C', 
            subjects: [
                { name: 'Français', coefficient: 3 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 7 },
                { name: 'PC (Physique-Chimie)', coefficient: 6 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 4 },
                { name: 'Philosophie', coefficient: 2 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        { 
            name: '1ère D', 
            subjects: [
                { name: 'Français', coefficient: 3 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 6 },
                { name: 'PC (Physique-Chimie)', coefficient: 5 },
                { name: 'HG (Histoire-Géo)', coefficient: 2 },
                { name: 'SVT (Sciences)', coefficient: 5 },
                { name: 'Philosophie', coefficient: 2 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        // 2nd Cycle - Terminale
        { 
            name: 'Tle C', 
            subjects: [
                { name: 'Français', coefficient: 2 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 9 },
                { name: 'PC (Physique-Chimie)', coefficient: 8 },
                { name: 'HG (Histoire-Géo)', coefficient: 1 },
                { name: 'SVT (Sciences)', coefficient: 4 },
                { name: 'Philosophie', coefficient: 4 },
                { name: 'EPS', coefficient: 1 },
            ]
        },
        { 
            name: 'Tle D', 
            subjects: [
                { name: 'Français', coefficient: 2 },
                { name: 'Anglais', coefficient: 2 },
                { name: 'Mathématiques', coefficient: 7 },
                { name: 'PC (Physique-Chimie)', coefficient: 6 },
                { name: 'HG (Histoire-Géo)', coefficient: 1 },
                { name: 'SVT (Sciences)', coefficient: 6 },
                { name: 'Philosophie', coefficient: 4 },
                { name: 'EPS', coefficient: 1 },
            ]
        }
    ];
}


function createDefaultClassesIfEmpty() {
    const transaction = db.transaction(['classes'], 'readwrite');
    const store = transaction.objectStore('classes');
    
    const countRequest = store.count();
    
    countRequest.onsuccess = () => {
        if (countRequest.result === 0) {
            console.log('Insertion des classes par défaut du Cameroun...');
            const classesToInsert = getCameroonianDefaultClasses();
            
            classesToInsert.forEach(classObj => {
                const newClass = {
                    name: classObj.name,
                    subjects: classObj.subjects,
                    createdAt: new Date().toISOString()
                };
                store.add(newClass);
            });
            
            transaction.oncomplete = () => {
                console.log('Classes par défaut créées. Rafraîchissement des vues.');
                loadDashboard();
                loadClassesAndStudentsDetails();
                alert('Classes du secondaire général (6e à Tle C/D) créées automatiquement !');
            };
            
            transaction.onerror = (event) => {
                console.error('Erreur lors de l\'insertion des classes par défaut:', event.target.error);
            };
        } else {
            console.log('Des classes existent déjà. Aucune classe par défaut insérée.');
        }
    };
    
    countRequest.onerror = (event) => {
        console.error('Erreur lors du comptage des classes:', event.target.error);
    };
}


// Initialisation de la base de données

function initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
        console.error('Erreur ouverture DB');
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        
        // VÉRIFICATION / CRÉATION DES CLASSES PAR DÉFAUT
        createDefaultClassesIfEmpty();
        
        loadDashboard();
        loadClassesAndStudentsDetails();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        
        // Création ou mise à jour de l'Object Store 'classes'
        if (!db.objectStoreNames.contains('classes')) {
            db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
        }
        
        // Création ou mise à jour de l'Object Store 'students'
        if (!db.objectStoreNames.contains('students')) {
             // Utiliser autoIncrement pour les nouveaux élèves, nécessaire pour l'import/export
             db.createObjectStore('students', { keyPath: 'id', autoIncrement: true }); 
        }
        
        // Création ou mise à jour de l'Object Store 'grades'
        if (!db.objectStoreNames.contains('grades')) {
            const gradesStore = db.createObjectStore('grades', { keyPath: 'id', autoIncrement: true });
            gradesStore.createIndex('studentId', 'studentId', { unique: false });
        }
    };
}

// Gestion des onglets

function switchTab(event,tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Logique de chargement pour les onglets
    if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'classes_management') {
        loadClassesAndStudentsDetails();
    } else if (tabName === 'grades') {
        loadGradesClassesList(); // Charger les cartes de classe pour la saisie des notes
    } else if (tabName === 'results') {
        loadResultsClassesList(); // NOUVEAU: Charger les cartes de classe pour les résultats
    }
}

// --- GESTION DES CLASSES ET ÉLÈVES (PAR CARTES) ---

function deleteClass(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe? Cette action est irréversible.')) return;

    const transaction = db.transaction(['classes'], 'readwrite');
    transaction.objectStore('classes').delete(id);
    
    transaction.oncomplete = () => {
        loadDashboard();
        loadClassesAndStudentsDetails(); 
    };
}

function openAddStudentModal(classId, className) {
    const modal = document.getElementById('addStudentModal');
    const title = modal.querySelector('h2');
    const input = document.getElementById('newStudentName');
    
    title.textContent = `Ajouter un élève à : ${className}`;
    input.dataset.classId = classId;
    input.value = '';
    modal.style.display = 'block';
}

function closeAddStudentModal() {
    const modal = document.getElementById('addStudentModal');
    document.getElementById('newStudentName').removeAttribute('data-class-id');
    modal.style.display = 'none';
}

async function saveNewStudentFromModal() {
    const input = document.getElementById('newStudentName');
    const name = input.value.trim();
    const classId = parseInt(input.dataset.classId);
    
    if (!name) {
        alert('Veuillez entrer un nom pour l\'élève');
        return;
    }
    if (!classId) {
        alert('Erreur: Classe cible non définie.');
        return;
    }

    const student = {
        name,
        classId, 
        createdAt: new Date().toISOString()
    };

    const transaction = db.transaction(['students'], 'readwrite');
    const store = transaction.objectStore('students');
    const request = store.add(student);

    request.onsuccess = async () => {
        closeAddStudentModal();
        alert(`Élève "${name}" ajouté à la classe ID ${classId}!`);
        
        loadDashboard();
        await loadClassesAndStudentsDetails();
        
        const modal = document.getElementById('classModal');
        if (modal.style.display === 'block') {
            const classObj = await new Promise((resolve) => {
                db.transaction('classes', 'readonly').objectStore('classes').get(classId).onsuccess = (e) => resolve(e.target.result);
            });
            // Re-open class modal in the correct mode
            openClassModal(classId, classObj.name, 'management');
        }
    };

    request.onerror = () => {
        alert('Erreur lors de l\'enregistrement de l\'élève');
    };
}

// Fonction qui charge les cartes de classe pour l'onglet 'Classes & Élèves'
async function loadClassesAndStudentsDetails() { 
    if (!db) return; 

    const listContainer = document.getElementById('classesAndStudentsList');
    listContainer.innerHTML = '<p style="text-align: center;">Chargement des classes...</p>';
    
    const classes = await new Promise((resolve) => {
        db.transaction('classes', 'readonly').objectStore('classes').getAll().onsuccess = (e) => resolve(e.target.result);
    });
    
    const students = await new Promise((resolve) => {
        db.transaction('students', 'readonly').objectStore('students').getAll().onsuccess = (e) => resolve(e.target.result);
    });

    const studentsCountMap = students.reduce((acc, s) => {
        acc[s.classId] = (acc[s.classId] || 0) + 1;
        return acc;
    }, {});
    
    let html = '<div class="class-cards-container">';
    
    if (classes.length === 0) {
         listContainer.innerHTML = '<p>Aucune classe enregistrée. Les classes par défaut du Cameroun devraient s\'afficher au premier chargement.</p>';
         return;
    }

    classes.forEach(classObj => {
        const studentCount = studentsCountMap[classObj.id] || 0;
        const safeClassName = classObj.name.replace(/'/g, "\\'");

        html += `
            <div class="class-card-management">
                <div class="card-summary" onclick="openClassModal(${classObj.id}, '${safeClassName}', 'management')" style="cursor: pointer;">
                    <h3>${classObj.name}</h3>
                    <p>Élèves: <span>${studentCount}</span></p>
                    <p>Matières: <span>${classObj.subjects.length}</span></p>
                </div>
                <div style="padding: 10px 20px; text-align: right; border-top: 1px solid #f3f4f6;">
                     <button class="btn btn-add btn-sm" style="margin-right: 10px;" onclick="openAddStudentModal(${classObj.id}, '${safeClassName}')">+ Élève</button>
                     <button class="btn btn-danger btn-sm" onclick="deleteClass(${classObj.id})">Supprimer la classe</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    listContainer.innerHTML = html;
}

function deleteStudentAndRefreshModal(studentId, classId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élève et toutes ses notes?')) return;

    const studentTransaction = db.transaction(['students'], 'readwrite');
    studentTransaction.objectStore('students').delete(studentId);
    
    // Supprimer les notes associées
    const gradesTransaction = db.transaction(['grades'], 'readwrite');
    const gradesStore = gradesTransaction.objectStore('grades');
    gradesStore.index('studentId').openCursor(IDBKeyRange.only(studentId)).onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            gradesStore.delete(cursor.primaryKey);
            cursor.continue();
        }
    };

    studentTransaction.oncomplete = async () => {
        alert('Élève supprimé.');
        
        loadDashboard();
        await loadClassesAndStudentsDetails();
        
        // Revenir à la liste des élèves après suppression
        const modalTitleElement = document.getElementById('modalTitle');
        const classNameMatch = modalTitleElement.textContent.match(/Gestion des élèves : (.*)/);
        const mode = modalTitleElement.dataset.mode;
        
        if(classNameMatch && classNameMatch[1]) {
           await openClassModal(classId, classNameMatch[1], mode); 
        } else {
           closeClassModal();
        }
    };
    
    studentTransaction.onerror = () => {
        alert('Erreur lors de la suppression de l\'élève.');
    };
}


// --- LOGIQUE DU TABLEAU DE BORD ET MODALE ---

/**
 * @function computeAverages
 * @description Fonction de calcul des moyennes (par séquence, trimestre, année) pour un élève donné.
 */
function computeAverages(classObj, gradesData) {
    const subjects = classObj.subjects; 
    const sequences = [];
    const trimesters = [[], [], []];

    // Moyennes par séquence
    gradesData.forEach((seqGrades, index) => {
        let sum = 0;
        let coefSum = 0;
        
        subjects.forEach((subject, subIndex) => {
            const grade = seqGrades[subIndex];
            if (grade !== null && grade >= 0 && grade <= 20) {
                sum += grade * subject.coefficient;
                coefSum += subject.coefficient;
            }
        });
        
        const avg = coefSum > 0 ? sum / coefSum : null;
        sequences.push(avg);
        
        // Attribution au trimestre (S1/S2 -> T1, S3/S4 -> T2, S5/S6 -> T3)
        const trimester = Math.floor(index / 2); 
        if (avg !== null) trimesters[trimester].push(avg);
    });

    // Moyennes par trimestre
    const trimesterAvgs = trimesters.map(trim => {
        if (trim.length === 0) return null;
        const validSeqAvgs = trim.filter(t => t !== null);
        return validSeqAvgs.length > 0 ? validSeqAvgs.reduce((a, b) => a + b, 0) / validSeqAvgs.length : null;
    });

    // Moyenne générale (Moyenne des trimestres)
    const validTrims = trimesterAvgs.filter(t => t !== null);
    const yearAvg = validTrims.length > 0 
        ? validTrims.reduce((a, b) => a + b, 0) / validTrims.length 
        : null;

    return { sequences, trimesters: trimesterAvgs, year: yearAvg };
}


// --- FONCTIONS SPÉCIFIQUES AU BULLETIN (REFONDUES POUR PLUS DE FLEXIBILITÉ) ---

const sequences = ['Séquence 1', 'Séquence 2', 'Séquence 3', 'Séquence 4', 'Séquence 5', 'Séquence 6'];

/**
 * @function generateReportHTML
 * @description Génère le HTML du bulletin pour l'impression.
 */
function generateReportHTML(reportType, period, studentName, className, classObj, studentGrades, gradesData, results) {
    const subjects = classObj.subjects;
    let periodTitle = '';
    let gradesToDisplay = [];
    let periodAverage = null;
    let totalCoef = subjects.reduce((sum, s) => sum + s.coefficient, 0);

    if (reportType === 'sequence') {
        periodTitle = `BULLETIN DE NOTES - ${sequences[period - 1]} (Trimestre ${Math.ceil(period / 2)})`;
        gradesToDisplay = [period - 1]; // Index de la séquence
        periodAverage = results.sequences[period - 1];
    } else if (reportType === 'trimester') {
        periodTitle = `BULLETIN DE NOTES - TRIMESTRE ${period}`;
        // Les séquences 1/2 sont T1, 3/4 sont T2, 5/6 sont T3
        gradesToDisplay = (period === 1) ? [0, 1] : (period === 2) ? [2, 3] : [4, 5];
        periodAverage = results.trimesters[period - 1];
    } else if (reportType === 'annual') {
        periodTitle = 'BULLETIN ANNUEL';
        gradesToDisplay = [0, 1, 2, 3, 4, 5]; // Toutes les séquences
        periodAverage = results.year;
    }
    
    // Calcul de la moyenne de la période pour chaque matière
    const subjectAverages = subjects.map((subject, subIndex) => {
        const validGrades = gradesToDisplay
            .map(seqIndex => gradesData[seqIndex] ? gradesData[seqIndex][subIndex] : null)
            .filter(g => g !== null);
        
        return validGrades.length > 0 
            ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length 
            : null;
    });
    
    // Calcul du total des points
    let totalPoints = 0;
    let totalPointsCoef = 0;

    subjectAverages.forEach((avg, index) => {
        if (avg !== null) {
            totalPoints += avg * subjects[index].coefficient;
            totalPointsCoef += subjects[index].coefficient;
        }
    });
    
    // --- Structure HTML du Bulletin ---

    let html = `
        <style>
            .report-card { 
                font-family: 'Lato', sans-serif; 
                width: 210mm; 
                min-height: 297mm; 
                margin: 0 auto; 
                padding: 10mm; 
                border: 1px solid #ccc;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header-report { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .header-report h1 { font-size: 1.5em; margin: 5px 0; }
            .info-table { width: 100%; margin-bottom: 20px; font-size: 1.1em; }
            .info-table td { padding: 5px; }
            .info-table strong { font-weight: 700; }
            
            .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 0.9em; }
            .grades-table th, .grades-table td { 
                border: 1px solid #000; 
                padding: 8px; 
                text-align: center;
            }
            .grades-table th { background-color: #f0f0f0; font-weight: 700; }
            .grades-table .subject-name { text-align: left; font-weight: 600; width: 30%; }
            .average-row td { background-color: #e0e0e0; font-weight: 700; }
            .signature-block { display: flex; justify-content: space-around; margin-top: 50px; }
            .signature-block div { text-align: center; }
        </style>
        <div class="report-card">
            <div class="header-report">
                <h2>Établissement Scolaire</h2>
                <h1>${periodTitle}</h1>
            </div>

            <table class="info-table">
                <tr>
                    <td style="width: 50%;"><strong>Nom et Prénom:</strong> ${studentName}</td>
                    <td style="width: 50%;"><strong>Classe:</strong> ${className}</td>
                </tr>
                <tr>
                    <td><strong>Année Scolaire:</strong> ${new Date().getFullYear() - 1}/${new Date().getFullYear()}</td>
                    <td><strong>Effectif de la classe:</strong> N/A (Non géré)</td>
                </tr>
            </table>

            <table class="grades-table">
                <thead>
                    <tr>
                        <th class="subject-name">Matières</th>
                        <th>Coeff.</th>
                        <th>Moy. Période</th>
                        <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${subjects.map((subject, index) => {
                        const avg = subjectAverages[index];
                        const totalSubPoints = avg !== null ? (avg * subject.coefficient).toFixed(2) : 'N/A';
                        const avgDisplay = avg !== null ? avg.toFixed(2) : 'N/A';
                        return `
                            <tr>
                                <td class="subject-name">${subject.name}</td>
                                <td>${subject.coefficient}</td>
                                <td>${avgDisplay}</td>
                                <td>${totalSubPoints}</td>
                            </tr>
                        `;
                    }).join('')}
                    <tr class="average-row">
                        <td class="subject-name">TOTAUX</td>
                        <td>${totalCoef}</td>
                        <td></td>
                        <td>${totalPoints.toFixed(2)}</td>
                    </tr>
                    <tr class="average-row">
                        <td colspan="2" class="subject-name">MOYENNE GÉNÉRALE</td>
                        <td colspan="2">${periodAverage !== null ? periodAverage.toFixed(2) + '/20' : 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            <div class="signature-block">
                <div>
                    <p>Le Professeur Principal / Titulaire</p>
                    <div style="height: 50px; border-bottom: 1px solid #000; width: 200px; margin: 10px auto;"></div>
                </div>
                <div>
                    <p>Le Chef d'Établissement</p>
                    <div style="height: 50px; border-bottom: 1px solid #000; width: 200px; margin: 10px auto;"></div>
                </div>
            </div>
            
            <p style="text-align: right; margin-top: 30px; font-style: italic;">Fait à [Ville], le ${new Date().toLocaleDateString('fr-FR')}</p>

        </div>
    `;
    return html;
}

/**
 * @function generateAndPrintReport
 * @description Fonction unique et flexible pour calculer et imprimer les bulletins (séquentiel, trimestriel, annuel).
 */
async function generateAndPrintReport(studentId, reportType, periodNumber) {
    if (!studentId || !db) return alert("Sélectionnez un élève.");

    const transaction = db.transaction(['students', 'classes', 'grades'], 'readonly');
    const studentsStore = transaction.objectStore('students');
    const classesStore = transaction.objectStore('classes');
    const gradesStore = transaction.objectStore('grades');
    
    let student = await new Promise(resolve => studentsStore.get(studentId).onsuccess = e => resolve(e.target.result));
    if (!student) return alert("Élève non trouvé.");
    
    let studentClass = await new Promise(resolve => classesStore.get(student.classId).onsuccess = e => resolve(e.target.result));
    if (!studentClass) return alert("Classe non trouvée.");
    
    let gradesEntry = await new Promise(resolve => gradesStore.index('studentId').get(studentId).onsuccess = e => resolve(e.target.result));
    
    if (!gradesEntry || !gradesEntry.data) return alert("Aucune note enregistrée pour cet élève.");
    
    const gradesData = gradesEntry.data;
    const results = computeAverages(studentClass, gradesData);
    
    // Vérification de la période si elle est N/A
    if (reportType === 'sequence' && results.sequences[periodNumber - 1] === null) {
        return alert(`Impossible de générer le bulletin: Aucune note pour la ${sequences[periodNumber - 1]}.`);
    }
    if (reportType === 'trimester' && results.trimesters[periodNumber - 1] === null) {
        return alert(`Impossible de générer le bulletin: Les moyennes du Trimestre ${periodNumber} sont incomplètes.`);
    }
    if (reportType === 'annual' && results.year === null) {
        return alert(`Impossible de générer le bulletin: La moyenne annuelle est incomplète.`);
    }


    const reportHTML = generateReportHTML(
        reportType, 
        periodNumber, 
        student.name, 
        studentClass.name, 
        studentClass, 
        gradesEntry, 
        gradesData, 
        results
    );
    
    // Création de la fenêtre d'impression
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
        alert("Veuillez autoriser les pop-ups pour imprimer le bulletin.");
        return;
    }
    printWindow.document.write('<html><head><title>Bulletin</title>');
    // Inclure le style du site pour les polices, etc.
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = 'style.css'; 
    printWindow.document.head.appendChild(styleLink);
    printWindow.document.write('</head><body>');
    printWindow.document.write(reportHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // On attend un peu pour que la feuille de style soit chargée
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
            // printWindow.close(); // Laisser l'utilisateur fermer
        }, 300); 
    };
}


async function getAverageForClass(classId) {
    const classObj = await new Promise((resolve) => {
        db.transaction('classes', 'readonly').objectStore('classes').get(classId).onsuccess = (e) => resolve(e.target.result);
    });

    if (!classObj || classObj.subjects.length === 0) return null;

    const students = await new Promise((resolve) => {
        db.transaction('students', 'readonly').objectStore('students').getAll().onsuccess = (e) => {
            const allStudents = e.target.result;
            resolve(allStudents.filter(s => s.classId === classId));
        };
    });

    if (students.length === 0) return null;

    let totalYearAvg = 0;
    let studentsWithAvgCount = 0;

    for (const student of students) {
        const gradesEntry = await new Promise((resolve) => {
            db.transaction('grades', 'readonly').objectStore('grades').index('studentId').get(student.id).onsuccess = (e) => resolve(e.target.result);
        });

        if (gradesEntry && gradesEntry.data) {
            const results = computeAverages(classObj, gradesEntry.data); 
            if (results.year !== null) {
                totalYearAvg += results.year;
                studentsWithAvgCount++;
            }
        }
    }

    return studentsWithAvgCount > 0 ? totalYearAvg / studentsWithAvgCount : null;
}

/**
 * @function generateStudentsListHTML
 * @description Génère le contenu HTML pour la liste des élèves, adapté au mode (dashboard, management, grades, results).
 */
async function generateStudentsListHTML(classId, mode) {
    const classObj = await new Promise((resolve) => {
        db.transaction('classes', 'readonly').objectStore('classes').get(classId).onsuccess = (e) => resolve(e.target.result);
    });
    if (!classObj) return '<ul><li class="student-avg-item">Détails de classe introuvables.</li></ul>';

    const students = await new Promise((resolve) => {
        db.transaction('students', 'readonly').objectStore('students').getAll().onsuccess = (e) => {
            const allStudents = e.target.result;
            resolve(allStudents.filter(s => s.classId === classId));
        };
    });

    if (students.length === 0) return '<ul><li class="student-avg-item">Aucun élève enregistré dans cette classe.</li></ul>';

    let html = '<ul>';
    
    for (const student of students) {
        const safeStudentName = student.name.replace(/'/g, "\\'");
        
        let actionButtonHTML = '';
        let onclickAction = '';
        
        if (mode === 'dashboard') {
            const gradesEntry = await new Promise((resolve) => {
                db.transaction('grades', 'readonly').objectStore('grades').index('studentId').get(student.id).onsuccess = (e) => resolve(e.target.result);
            });
            const results = gradesEntry && gradesEntry.data 
                ? computeAverages(classObj, gradesEntry.data) 
                : { year: null };
            
            const avgDisplay = results.year !== null ? results.year.toFixed(2) + '/20' : 'N/A';
            const avgClass = results.year !== null && results.year >= 10 ? 'pass' : 'fail';
            actionButtonHTML = `<span class="student-avg-score ${avgClass}">${avgDisplay}</span>`;
            onclickAction = `viewStudentDetailsModal(${student.id}, '${safeStudentName}', ${classObj.id})`;
        } else if (mode === 'management') {
            actionButtonHTML = `<button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteStudentAndRefreshModal(${student.id}, ${classObj.id})">Supprimer l'élève</button>`;
            onclickAction = `viewStudentDetailsModal(${student.id}, '${safeStudentName}', ${classObj.id})`;
        } else if (mode === 'grades') {
            // NOUVEAU: Pour la saisie des notes
            actionButtonHTML = `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openStudentGradesModal(${student.id}, '${safeStudentName}', ${classObj.id})">Saisir les notes</button>`;
            onclickAction = `openStudentGradesModal(${student.id}, '${safeStudentName}', ${classObj.id})`; 
        } else if (mode === 'results') { // NOUVEAU: Pour la consultation des résultats
             actionButtonHTML = `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); viewStudentDetailsModal(${student.id}, '${safeStudentName}', ${classObj.id})">Voir Bulletin</button>`;
             onclickAction = `viewStudentDetailsModal(${student.id}, '${safeStudentName}', ${classObj.id})`;
        }

        html += `
            <li class="student-avg-item" 
                onclick="${onclickAction}"
                style="border-bottom: 1px solid #eef2ff; cursor: pointer;">
                <span class="student-avg-name">${safeStudentName}</span>
                ${actionButtonHTML}
            </li>
        `;
    }

    html += '</ul>';
    return html;
}

// Fonction qui ouvre la modale de classe avec la liste des élèves
async function openClassModal(classId, className, mode = 'dashboard') {
    const modal = document.getElementById('classModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    // Adaptation du titre
    let titlePrefix;
    if (mode === 'management') titlePrefix = 'Gestion des élèves';
    else if (mode === 'grades') titlePrefix = 'Sélection de l\'élève pour la saisie des notes';
    else if (mode === 'results') titlePrefix = 'Sélection de l\'élève pour le bulletin'; 
    else if (mode === 'creation') titlePrefix = 'Création d\'une nouvelle classe'; // MODIFIÉ
    else titlePrefix = 'Résultats de la classe';

    title.textContent = `${titlePrefix} : ${className === 'Nouvelle' ? '' : className}`; // Ajusté pour le mode 'creation'
    title.dataset.mode = mode; 
    title.dataset.classId = classId;
        
    body.innerHTML = '<p class="loading-message" style="text-align:center;">Chargement des données...</p>';
    modal.style.display = 'block';
    
    // --- Logic for Class Creation Mode ---
    if (mode === 'creation') {
        const creationHtml = generateClassCreationForm();
        body.innerHTML = creationHtml;
        addSubjectInput(); // Ajoute un champ de matière par défaut
        return; // Stop here for creation mode
    }
    // ------------------------------------

    try {
        const html = await generateStudentsListHTML(classId, mode);
        body.innerHTML = html;
    } catch (error) {
        body.innerHTML = '<p style="color:red;text-align:center;">Erreur lors du chargement des données. Veuillez vérifier la console.</p>';
        console.error("Erreur chargement élèves pour modale:", error);
    }
}

async function viewStudentDetailsModal(studentId, studentName, classId) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const mode = modalTitle.dataset.mode || 'dashboard';

    modalTitle.innerHTML = `Détails des notes de : **${studentName}**`;
    modalBody.innerHTML = '<p class="loading-message" style="text-align:center;">Chargement des résultats...</p>';

    const transaction = db.transaction(['classes', 'grades'], 'readonly');
    const studentClass = await new Promise((resolve) => {
        transaction.objectStore('classes').get(classId).onsuccess = (e) => resolve(e.target.result);
    });

    const gradesEntry = await new Promise((resolve) => {
        transaction.objectStore('grades').index('studentId').get(studentId).onsuccess = (e) => resolve(e.target.result);
    });

    if (!studentClass) {
        modalBody.innerHTML = '<p style="color:red;text-align:center;">Erreur: Classe introuvable.</p>';
        return;
    }
    
    const results = gradesEntry && gradesEntry.data 
        ? computeAverages(studentClass, gradesEntry.data) 
        : { sequences: Array(6).fill(null), trimesters: [], year: null };
    
    const gradesData = gradesEntry ? gradesEntry.data : Array(6).fill(Array(studentClass.subjects.length).fill(null));

    const backButtonMode = mode === 'gradeEntry' ? 'grades' : (mode === 'results' ? 'results' : 'dashboard');

    const backButtonHTML = `
        <button class="btn btn-sm" onclick="returnToClassListModal(${classId}, '${studentClass.name.replace(/'/g, "\\'")}', '${backButtonMode}')" style="margin-bottom: 20px; background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);">
            ← Retour à la liste de classe
        </button>
    `;
    
    let html = backButtonHTML;
    
    html += `
        <div class="results-summary" style="margin-bottom: 30px;">
            <h4 style="color: #4f46e5;">Résultats Annuels et Trimestriels</h4>
            <div class="card" style="padding: 15px; margin-bottom: 20px;">
                <div class="result-item" style="border-bottom: 1px solid #eef2ff;">
                    <span style="font-weight: 700;">Moyenne Annuelle</span>
                    <span class="result-value avg-value ${results.year >= 10 ? 'pass' : 'fail'}">${results.year !== null ? results.year.toFixed(2) + '/20' : 'N/A'}</span>
                </div>
                ${results.trimesters.map((avg, index) => `
                    <div class="result-item" style="border-bottom: none;">
                        <span>Trimestre ${index + 1}</span>
                        <span class="result-value avg-value ${avg >= 10 ? 'pass' : 'fail'}">${avg !== null ? avg.toFixed(2) + '/20' : 'N/A'}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <h4 style="color: #4f46e5;">Détail des Notes et Moyennes par Séquence</h4>
    `;

    
    sequences.forEach((seqName, seqIndex) => {
        const avg = results.sequences[seqIndex];
        const avgDisplay = avg !== null ? avg.toFixed(2) + '/20' : 'N/A';
        const avgClass = avg !== null && avg >= 10 ? 'pass' : 'fail';
        
        html += `
            <div class="card" style="margin-bottom: 20px;">
                <h5 style="color: #4f46e5; margin-bottom: 10px; border-bottom: 1px solid #eef2ff; padding-bottom: 5px;">${seqName}</h5>
                <div class="grades-grid" style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
        `;
        
        studentClass.subjects.forEach((subject, subIndex) => {
            const note = gradesData[seqIndex] && gradesData[seqIndex][subIndex] !== undefined ? gradesData[seqIndex][subIndex] : null;
            const noteDisplay = note !== null ? note.toFixed(2) : 'N/A';
            const noteColor = note !== null && note >= 10 ? '#10b981' : '#ef4444';
            
            html += `
                <div class="grade-input" style="border: 1px solid #eef2ff; padding: 5px 8px; border-radius: 4px;">
                    <label style="font-size: 0.8em; font-weight: 400; color: #6b7280;">${subject.name} (Coef. ${subject.coefficient})</label>
                    <span style="font-weight: 700; color: ${noteColor};">${noteDisplay}</span>
                </div>
            `;
        });
        
        html += `
                </div>
                <div style="text-align: right; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eef2ff;">
                     <strong>Moyenne de Séquence :</strong> <span class="avg-value ${avgClass}">${avgDisplay}</span>
                </div>
            </div>
        `;
    });
    
    // --- Ajout des boutons d'impression de bulletins (Déplacé ici) ---
    if(gradesEntry) { // Seulement si des notes existent
        html += `
            <div class="card" style="margin-top: 30px;">
                <h4 style="color: #4f46e5;">Génération des Bulletins </h4>
                
                <div style="margin-top: 15px;">
                     <button class="btn btn-primary" style="margin-right: 10px;" onclick="generateAndPrintReport(${studentId}, 'annual', 1)">Bulletin Annuel</button>
                </div>
                
                <div style="margin-top: 15px;">
                    <h5 style="margin-bottom: 5px;">Bulletins Trimestriels</h5>
                    <button class="btn btn-secondary" style="margin-right: 10px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'trimester', 1)">Trimestre 1</button>
                    <button class="btn btn-secondary" style="margin-right: 10px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'trimester', 2)">Trimestre 2</button>
                    <button class="btn btn-secondary" style="margin-right: 10px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'trimester', 3)">Trimestre 3</button>
                </div>
                
                <div style="margin-top: 15px;">
                    <h5 style="margin-bottom: 5px;">Bulletins Séquentiels</h5>
                    <button class="btn btn-sm" style="margin-right: 5px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'sequence', 1)">Séquence 1</button>
                    <button class="btn btn-sm" style="margin-right: 5px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'sequence', 2)">Séquence 2</button>
                    <button class="btn btn-sm" style="margin-right: 5px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'sequence', 3)">Séquence 3</button>
                    <button class="btn btn-sm" style="margin-right: 5px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'sequence', 4)">Séquence 4</button>
                    <button class="btn btn-sm" style="margin-right: 5px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'sequence', 5)">Séquence 5</button>
                    <button class="btn btn-sm" style="margin-right: 5px; margin-bottom: 5px;" onclick="generateAndPrintReport(${studentId}, 'sequence', 6)">Séquence 6</button>
                </div>
            </div>
        `;
    }
    
    html += backButtonHTML;
    
    modalBody.innerHTML = html;
}

async function returnToClassListModal(classId, className, mode) {
    await openClassModal(classId, className, mode); 
}

function closeClassModal() {
    document.getElementById('classModal').style.display = 'none';
    // Clean up dataset attributes on close
    const title = document.getElementById('modalTitle');
    title.removeAttribute('data-mode');
    title.removeAttribute('data-class-id');
    title.removeAttribute('data-student-id');
}


async function loadDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<p>Chargement des données en cours...</p>';

    if (!db) return;

    const classes = await new Promise((resolve) => {
        db.transaction('classes', 'readonly').objectStore('classes').getAll().onsuccess = (e) => resolve(e.target.result);
    });
    
    const students = await new Promise((resolve) => {
        db.transaction('students', 'readonly').objectStore('students').getAll().onsuccess = (e) => resolve(e.target.result);
    });

    const studentsCountMap = students.reduce((acc, s) => {
        acc[s.classId] = (acc[s.classId] || 0) + 1;
        return acc;
    }, {});
    
    let html = '<div class="class-cards-container">';

    for (const classObj of classes) {
        const studentCount = studentsCountMap[classObj.id] || 0;
        const subjectCount = classObj.subjects.length;
        
        const classAvg = await getAverageForClass(classObj.id); 
        const avgDisplay = classAvg !== null ? classAvg.toFixed(2) + '/20' : 'N/A';
        const avgClass = classAvg !== null && classAvg >= 10 ? 'pass' : 'fail';
        
        const safeClassName = classObj.name.replace(/'/g, "\\'");

        html += `
            <div class="class-card" onclick="openClassModal(${classObj.id}, '${safeClassName}', 'dashboard')">
                <div class="card-summary">
                    <h3>${classObj.name}</h3>
                    <p>Élèves: <span>${studentCount}</span></p>
                    <p>Matières: <span>${subjectCount}</span></p>
                    <p>Moy. Classe: <span class="avg-value ${avgClass}">${avgDisplay}</span></p>
                </div>
            </div>
        `;
    }

    html += '</div>';
    
    if (classes.length === 0) {
         dashboardContent.innerHTML = '<p>Aucune classe enregistrée. Les classes par défaut du Cameroun devraient s\'afficher au premier chargement.</p>';
    } else {
         dashboardContent.innerHTML = html;
    }
}


// --- GESTION DES NOTES ET RÉSULTATS (Refonte) ---

/**
 * @function loadGradesClassesList
 * @description Charge les cartes de classe pour l'onglet 'Notes'.
 */
async function loadGradesClassesList() {
    const listContainer = document.getElementById('gradesClassesContainer');
    if (!listContainer) return;
    listContainer.innerHTML = '<p style="text-align: center;">Chargement des classes...</p>';
    if (!db) return; 

    const classes = await new Promise((resolve) => {
        db.transaction('classes', 'readonly').objectStore('classes').getAll().onsuccess = (e) => resolve(e.target.result);
    });
    
    const students = await new Promise((resolve) => {
        db.transaction('students', 'readonly').objectStore('students').getAll().onsuccess = (e) => resolve(e.target.result);
    });

    const studentsCountMap = students.reduce((acc, s) => {
        acc[s.classId] = (acc[s.classId] || 0) + 1;
        return acc;
    }, {});
    
    let html = '<div class="class-cards-container">';
    
    if (classes.length === 0) {
         listContainer.innerHTML = '<p>Aucune classe enregistrée. </p>';
         return;
    }

    classes.forEach(classObj => {
        const studentCount = studentsCountMap[classObj.id] || 0;
        const safeClassName = classObj.name.replace(/'/g, "\\'");

        html += `
            <div class="class-card-management" onclick="openClassModal(${classObj.id}, '${safeClassName}', 'grades')" style="cursor: pointer;">
                <div class="card-summary">
                    <h3>${classObj.name}</h3>
                    <p>Élèves: <span>${studentCount}</span></p>
                    <p>Matières: <span>${classObj.subjects.length}</span></p>
                </div>
                <div style="padding: 10px 20px; text-align: center; border-top: 1px solid #f3f4f6;">
                     <button class="btn btn-primary btn-sm" style="pointer-events: none;">Saisir les notes</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    listContainer.innerHTML = html;
}

/**
 * @function loadResultsClassesList
 * @description Charge les cartes de classe pour l'onglet 'Résultats'.
 */
async function loadResultsClassesList() {
    const listContainer = document.getElementById('resultsClassesContainer');
    if (!listContainer) return;
    listContainer.innerHTML = '<p style="text-align: center;">Chargement des classes...</p>';
    if (!db) return; 

    const classes = await new Promise((resolve) => {
        db.transaction('classes', 'readonly').objectStore('classes').getAll().onsuccess = (e) => resolve(e.target.result);
    });
    
    const students = await new Promise((resolve) => {
        db.transaction('students', 'readonly').objectStore('students').getAll().onsuccess = (e) => resolve(e.target.result);
    });

    const studentsCountMap = students.reduce((acc, s) => {
        acc[s.classId] = (acc[s.classId] || 0) + 1;
        return acc;
    }, {});
    
    let html = '<div class="class-cards-container">';
    
    if (classes.length === 0) {
         listContainer.innerHTML = '<p>Aucune classe enregistrée.</p>';
         return;
    }

    classes.forEach(classObj => {
        const studentCount = studentsCountMap[classObj.id] || 0;
        const safeClassName = classObj.name.replace(/'/g, "\\'");

        html += `
            <div class="class-card-management" onclick="openClassModal(${classObj.id}, '${safeClassName}', 'results')" style="cursor: pointer;">
                <div class="card-summary">
                    <h3>${classObj.name}</h3>
                    <p>Élèves: <span>${studentCount}</span></p>
                    <p>Matières: <span>${classObj.subjects.length}</span></p>
                </div>
                <div style="padding: 10px 20px; text-align: center; border-top: 1px solid #f3f4f6;">
                     <button class="btn btn-primary btn-sm" style="pointer-events: none;">Consulter les résultats</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    listContainer.innerHTML = html;
}


/**
 * @function openStudentGradesModal
 * @description Ouvre la modale pour saisir les notes d'un élève.
 */
async function openStudentGradesModal(studentId, studentName, classId) {
    const modal = document.getElementById('classModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    title.textContent = `Saisie des notes pour : ${studentName}`;
    title.dataset.studentId = studentId;
    title.dataset.classId = classId;
    title.dataset.mode = 'gradeEntry'; // Nouveau mode pour la sauvegarde
        
    body.innerHTML = '<p class="loading-message" style="text-align:center;">Chargement des notes...</p>';

    const transaction = db.transaction(['classes', 'grades'], 'readonly');
    const classesStore = transaction.objectStore('classes');
    const gradesStore = transaction.objectStore('grades');

    const studentClass = await new Promise(resolve => classesStore.get(classId).onsuccess = e => resolve(e.target.result));
    if (!studentClass) {
        body.innerHTML = '<p style="color:red;text-align:center;">Classe introuvable.</p>';
        return;
    }
    const subjects = studentClass.subjects; 

    const gradesEntry = await new Promise(resolve => gradesStore.index('studentId').get(studentId).onsuccess = e => resolve(e.target.result));
    const existingGrades = gradesEntry ? gradesEntry.data : Array(6).fill(Array(subjects.length).fill(null));

    const backButtonHTML = `<button class="btn btn-sm" onclick="returnToGradesClassListModal(${classId}, '${studentClass.name.replace(/'/g, "\\'")}')" style="margin-bottom: 20px; background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);">
        ← Retour à la liste des élèves
    </button>`;

    let html = backButtonHTML;
    
    html += '<div id="gradesContainerModal">'; // Conteneur pour toutes les séquences
    
    sequences.forEach((seqName, seqIndex) => {
        html += `
            <div class="card" style="margin-bottom: 15px;">
                <h5 style="color: #4f46e5; margin-bottom: 10px; border-bottom: 1px solid #eef2ff; padding-bottom: 5px;">${seqName}</h5>
                <div class="grades-grid" style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
        `;
        
        subjects.forEach((subject, subIndex) => {
            const grade = existingGrades[seqIndex] && existingGrades[seqIndex][subIndex] !== undefined ? existingGrades[seqIndex][subIndex] : '';
            
            html += `
                <div class="grade-input" style="border: 1px solid #eef2ff; padding: 5px 8px; border-radius: 4px;">
                    <label style="font-size: 0.8em; font-weight: 400; color: #6b7280;">${subject.name} (Coef. ${subject.coefficient})</label>
                    <input type="number" min="0" max="20" step="0.5" 
                           data-seq="${seqIndex}" 
                           data-sub="${subIndex}"
                           value="${grade}"
                           placeholder="Note/20"
                           style="width: 100%; border: 1px solid #ddd; padding: 5px; margin-top: 5px;">
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>'; // close #gradesContainerModal

    html += `
        <button class="btn" onclick="saveGradesFromModal()" style="margin-top: 20px; width: 100%;">
            Enregistrer les notes
        </button>
    `;

    body.innerHTML = html;
}

/**
 * @function returnToGradesClassListModal
 * @description Aide à la navigation pour revenir à la liste des élèves après la saisie.
 */
async function returnToGradesClassListModal(classId, className) {
    await openClassModal(classId, className, 'grades');
}

/**
 * @function saveGradesFromModal
 * @description Enregistre les notes saisies dans la modale.
 */
function saveGradesFromModal() {
    const titleElement = document.getElementById('modalTitle');
    const studentId = parseInt(titleElement.dataset.studentId);
    const classId = parseInt(titleElement.dataset.classId);
    // On extrait le nom de la classe de la liste des élèves (openClassModal) pour la fonction de retour
    const className = document.getElementById('modalTitle').textContent.split(': ')[1];

    if (isNaN(studentId) || isNaN(classId)) {
        alert("Erreur: Impossible de déterminer l'élève ou la classe.");
        return;
    }
    
    const gradesContainer = document.getElementById('gradesContainerModal');
    const inputs = gradesContainer.querySelectorAll('input[type="number"]');

    if (inputs.length === 0) {
        alert("Aucun champ de note trouvé.");
        return;
    }

    let maxSeq = -1;
    let maxSub = -1;
    inputs.forEach(input => {
        maxSeq = Math.max(maxSeq, parseInt(input.dataset.seq));
        maxSub = Math.max(maxSub, parseInt(input.dataset.sub));
    });

    // Initialise le tableau de notes (6 séquences x N matières)
    const gradesData = Array(maxSeq + 1).fill(0).map(() => Array(maxSub + 1).fill(null));

    let allValid = true;
    inputs.forEach(input => {
        const seq = parseInt(input.dataset.seq);
        const sub = parseInt(input.dataset.sub);
        const value = input.value.trim();
        let grade = null;

        if (value !== '') {
            grade = parseFloat(value);
            if (isNaN(grade) || grade < 0 || grade > 20) {
                allValid = false;
                input.style.border = '2px solid red';
            } else {
                input.style.border = '1px solid #ddd';
            }
        }
        
        if(gradesData[seq] && gradesData[seq][sub] !== undefined) {
             gradesData[seq][sub] = grade;
        }
    });

    if (!allValid) {
        alert("Veuillez corriger les notes invalides (doivent être entre 0 et 20).");
        return;
    }

    const transaction = db.transaction(['grades'], 'readwrite');
    const gradesStore = transaction.objectStore('grades');
    const index = gradesStore.index('studentId');
    const request = index.get(studentId);

    request.onsuccess = (e) => {
        const existing = e.target.result;
        if (existing) {
            existing.data = gradesData;
            gradesStore.put(existing);
        } else {
            gradesStore.add({
                studentId,
                data: gradesData
            });
        }
    };

    transaction.oncomplete = async () => {
        alert('Notes enregistrées avec succès!');
        
        // Recharger le tableau de bord et revenir à la liste des élèves
        loadDashboard(); 
        await returnToGradesClassListModal(classId, className);
    };
    
    transaction.onerror = (e) => {
        console.error("Erreur lors de l'enregistrement des notes:", e.target.error);
        alert("Erreur lors de l'enregistrement des notes.");
    };
}


/**
 * @function generateClassCreationForm
 * @description Génère le formulaire HTML pour la création d'une nouvelle classe avec gestion des matières.
 */
function generateClassCreationForm() {
    return `
        <div id="classCreationForm">
            <h4 style="color: #4f46e5;">Informations Générales</h4>
            <div class="form-group" style="margin-bottom: 20px;">
                <label for="newClassName">Nom de la classe (ex: 1ère C, Tle D)</label>
                <input type="text" id="newClassName" placeholder="Nom de la classe" required>
            </div>
            
            <h4 style="color: #4f46e5; margin-top: 30px;">Matières et Coefficients</h4>
            <div id="subjectsListContainer">
                <p>Cliquez sur "Ajouter une matière" pour commencer.</p>
            </div>

            <button class="btn btn-add" onclick="addSubjectInput()" style="margin-top: 10px;">+ Ajouter une matière</button>
            
            <button class="btn btn-primary" onclick="saveNewClass()" style="width: 100%; margin-top: 30px;">Enregistrer la Nouvelle Classe</button>
        </div>
    `;
}

/**
 * @function addSubjectInput
 * @description Ajoute une paire d'input (Nom de Matière et Coefficient).
 */
function addSubjectInput() {
    const container = document.getElementById('subjectsListContainer');
    // Si c'est le premier ajout, on retire le texte placeholder
    if (container.firstElementChild && container.firstElementChild.tagName === 'P') {
        container.innerHTML = '';
    }
    
    const index = container.children.length;

    const div = document.createElement('div');
    div.classList.add('subject-row');
    div.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end;';

    div.innerHTML = `
        <div class="form-group" style="flex-grow: 1;">
            <label for="subjectName_${index}">Matière</label>
            <input type="text" id="subjectName_${index}" placeholder="Nom de la matière" required>
        </div>
        <div class="form-group" style="width: 80px;">
            <label for="subjectCoef_${index}">Coeff.</label>
            <input type="number" id="subjectCoef_${index}" min="1" value="1" required>
        </div>
        <button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()" style="margin-bottom: 0;">&times;</button>
    `;

    container.appendChild(div);
}

/**
 * @function saveNewClass
 * @description Lit les données du formulaire de création et enregistre la nouvelle classe dans IndexedDB.
 */
function saveNewClass() {
    const classNameInput = document.getElementById('newClassName');
    const className = classNameInput.value.trim();
    
    if (!className) {
        alert("Veuillez donner un nom à la nouvelle classe.");
        classNameInput.focus();
        return;
    }
    
    const container = document.getElementById('subjectsListContainer');
    const subjectRows = container.querySelectorAll('.subject-row');
    
    if (subjectRows.length === 0) {
        alert("Veuillez ajouter au moins une matière.");
        return;
    }

    const subjects = [];
    let isValid = true;

    subjectRows.forEach(row => {
        const nameInput = row.querySelector('input[type="text"]');
        const coefInput = row.querySelector('input[type="number"]');
        
        const name = nameInput.value.trim();
        const coefficient = parseInt(coefInput.value);

        if (!name || isNaN(coefficient) || coefficient < 1) {
            isValid = false;
            nameInput.style.border = '1px solid red';
            coefInput.style.border = '1px solid red';
            return;
        }
        
        nameInput.style.border = '';
        coefInput.style.border = '';

        subjects.push({ name, coefficient });
    });

    if (!isValid) {
        alert("Veuillez corriger les champs Matière/Coefficient invalides (nom requis, coefficient >= 1).");
        return;
    }

    const newClass = {
        name: className,
        subjects: subjects,
        createdAt: new Date().toISOString()
    };
    
    const transaction = db.transaction(['classes'], 'readwrite');
    const store = transaction.objectStore('classes');
    
    const request = store.add(newClass);

    request.onsuccess = () => {
        closeClassModal();
        alert(`La classe "${className}" a été créée avec ${subjects.length} matière(s)!`);
        
        // Rafraîchir l'interface
        loadDashboard();
        loadClassesAndStudentsDetails();
    };

    request.onerror = (event) => {
        console.error('Erreur lors de l\'enregistrement de la classe:', event.target.error);
        alert('Erreur lors de l\'enregistrement de la classe.');
    };
}


// --- FONCTIONS IMPORT/EXPORT ---

/**
 * @function getAllDataFromStore
 * @description Récupère toutes les données d'un Object Store spécifié.
 */
function getAllDataFromStore(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (e) => {
            resolve(e.target.result);
        };
        request.onerror = (e) => {
            reject(e.target.error);
        };
    });
}

/**
 * @function exportData
 * @description Exporte toutes les données (classes, élèves et notes) dans un fichier JSON.
 */
async function exportData() {
    try {
        const students = await getAllDataFromStore('students');
        const grades = await getAllDataFromStore('grades');
        const classes = await getAllDataFromStore('classes');

        // Création de l'objet global à exporter
        const exportObject = {
            metadata: {
                version: DB_VERSION, 
                date: new Date().toISOString(),
                description: 'Exportation de la Gestion des Moyennes Scolaires'
            },
            stores: {
                classes: classes,
                students: students,
                grades: grades,
            }
        };

        const dataStr = JSON.stringify(exportObject, null, 2);
        
        // Création du Blob et du lien de téléchargement
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gms_export_' + new Date().toISOString().slice(0, 10) + '.json';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); 

        alert('Exportation réussie! Le fichier ' + a.download + ' a été téléchargé.');

    } catch (error) {
        console.error("Erreur lors de l'exportation:", error);
        alert('Erreur lors de l\'exportation des données. Consultez la console.');
    }
}


/**
 * @function handleImport
 * @description Gère l'événement de clic sur le bouton d'importation.
 */
function handleImport() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Veuillez sélectionner un fichier JSON à importer.');
        return;
    }

    if (!confirm("ATTENTION: L'importation va écraser TOUTES les données existantes (classes, élèves, notes) par celles du fichier. Continuer ?")) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonText = e.target.result;
            const data = JSON.parse(jsonText);
            importData(data);
        } catch (error) {
            console.error("Erreur de lecture ou de parsing JSON:", error);
            alert('Erreur: Le fichier n\'est pas un JSON valide ou est corrompu.');
        }
    };
    reader.readAsText(file);
}


/**
 * @function importData
 * @description Importe les données du fichier JSON vers IndexedDB.
 */
function importData(importedData) {
    if (!importedData.stores || !importedData.stores.students || !importedData.stores.grades || !importedData.stores.classes) {
        alert('Erreur: Le fichier JSON ne contient pas la structure de données attendue (classes, students et grades).');
        return;
    }

    const classData = importedData.stores.classes;
    const studentData = importedData.stores.students;
    const gradesData = importedData.stores.grades;
    
    // Utilisation d'une transaction unique pour tout effacer et réinsérer
    const transaction = db.transaction(['classes', 'students', 'grades'], 'readwrite');
    const classStore = transaction.objectStore('classes');
    const studentStore = transaction.objectStore('students');
    const gradesStore = transaction.objectStore('grades');

    // 1. Supprimer les données existantes
    classStore.clear();
    studentStore.clear();
    gradesStore.clear();
    
    // 2. Insérer les nouvelles données. 
    // On utilise put() qui permet de réinsérer les objets avec leurs IDs originaux.
    
    // Classes
    classData.forEach(item => classStore.put(item));
    
    // Élèves
    studentData.forEach(item => studentStore.put(item));
    
    // Notes
    gradesData.forEach(item => gradesStore.put(item));
    
    
    transaction.oncomplete = () => {
        alert('Importation réussie! La base de données a été restaurée.');
        // Rafraîchir l'interface
        loadDashboard();
        loadClassesAndStudentsDetails();
    };

    transaction.onerror = (e) => {
        console.error("Erreur lors de la transaction d'importation:", e.target.error);
        alert('Erreur lors de l\'importation des données.');
    };
}

// --- GESTION DES MODALES ---

// Ferme la modale si l'utilisateur clique en dehors
window.onclick = function(event) {
    const classModal = document.getElementById('classModal');
    const addStudentModal = document.getElementById('addStudentModal');
    
    if (event.target == classModal) {
        closeClassModal();
    }
     if (event.target == addStudentModal) {
        closeAddStudentModal();
    }
}


// --- Service Worker (PWA) ---

if ('serviceWorker' in navigator) {
    const swCode = `
        self.addEventListener('install', (event) => {
            self.skipWaiting();
        });

        self.addEventListener('activate', (event) => {
            event.waitUntil(clients.claim());
        });

        self.addEventListener('fetch', (event) => {
            event.respondWith(
                caches.match(event.request).then((response) => {
                    return response || fetch(event.request);
                })
            );
        });
    `;
    
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl).then(() => {
        const statusElement = document.getElementById('status');
        if (statusElement) statusElement.textContent = '✓ PWA activée';
    }).catch(() => {
        const statusElement = document.getElementById('status');
        if (statusElement) statusElement.textContent = '⚠ Mode en ligne';
    });
}

// Initialisation
window.addEventListener('load', () => {
    initDB();
});