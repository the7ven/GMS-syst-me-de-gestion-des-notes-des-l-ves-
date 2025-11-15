 // Configuration IndexedDB
        let db;
        const DB_NAME = 'GradesDB';
        const DB_VERSION = 1;

        // Initialisation de la base de données
        function initDB() {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Erreur ouverture DB');
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                loadStudentsList();
                updateStudentSelects();
            };

            request.onupgradeneeded = (event) => {
                db = event.target.result;
                
                if (!db.objectStoreNames.contains('students')) {
                    db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
                }
                
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
        }

        // Ajouter un champ de matière
        let subjectCount = 0;
        function addSubjectField() {
            const container = document.getElementById('subjectsList');
            const div = document.createElement('div');
            div.className = 'subject-item';
            div.innerHTML = `
                <input type="text" placeholder="Nom de la matière" class="subject-name">
                <input type="number" placeholder="Coef." min="1" max="10" value="1" class="subject-coef">
                <button class="btn btn-danger" onclick="this.parentElement.remove()">✕</button>
            `;
            container.appendChild(div);
            subjectCount++;
        }

        // Initialiser avec quelques matières par défaut
        function initDefaultSubjects() {
            const defaults = [
                {name: 'Mathématiques', coef: 5},
                {name: 'Français', coef: 3},
                {name: 'Anglais', coef: 2},
                {name: 'SVT', coef: 5},
                {name: 'Physiques', coef: 3},
                {name: 'Chimies', coef: 2},
                {name: 'Eps', coef: 1},
            ];
            
            defaults.forEach(sub => {
                const container = document.getElementById('subjectsList');
                const div = document.createElement('div');
                div.className = 'subject-item';
                div.innerHTML = `
                    <input type="text" placeholder="Nom de la matière" class="subject-name" value="${sub.name}">
                    <input type="number" placeholder="Coef." min="1" max="10" value="${sub.coef}" class="subject-coef">
                    <button class="btn btn-danger" onclick="this.parentElement.remove()">✕</button>
                `;
                container.appendChild(div);
            });
        }

        // Sauvegarder un élève
        function saveStudent() {
            const name = document.getElementById('studentName').value.trim();
            if (!name) {
                alert('Veuillez entrer un nom');
                return;
            }

            const subjectItems = document.querySelectorAll('.subject-item');
            const subjects = [];
            
            subjectItems.forEach(item => {
                const name = item.querySelector('.subject-name').value.trim();
                const coef = parseInt(item.querySelector('.subject-coef').value);
                if (name && coef) {
                    subjects.push({ name, coefficient: coef });
                }
            });

            if (subjects.length === 0) {
                alert('Ajoutez au moins une matière');
                return;
            }

            const student = {
                name,
                subjects,
                createdAt: new Date().toISOString()
            };

            const transaction = db.transaction(['students'], 'readwrite');
            const store = transaction.objectStore('students');
            const request = store.add(student);

            request.onsuccess = () => {
                alert('Élève enregistré avec succès!');
                document.getElementById('studentName').value = '';
                document.getElementById('subjectsList').innerHTML = '';
                initDefaultSubjects();
                loadStudentsList();
                updateStudentSelects();
            };

            request.onerror = () => {
                alert('Erreur lors de l\'enregistrement');
            };
        }

        // Charger la liste des élèves
        function loadStudentsList() {
            const transaction = db.transaction(['students'], 'readonly');
            const store = transaction.objectStore('students');
            const request = store.getAll();

            request.onsuccess = () => {
                const students = request.result;
                const list = document.getElementById('studentsList');
                list.innerHTML = '';

                students.forEach(student => {
                    const li = document.createElement('li');
                    li.className = 'student-item';
                    li.innerHTML = `
                        <div>
                            <strong>${student.name}</strong>
                            <div style="font-size: 0.9em; color: #6b7280;">
                                ${student.subjects.length} matières
                            </div>
                        </div>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Supprimer</button>
                    `;
                    list.appendChild(li);
                });
            };
        }

        // Supprimer un élève
        function deleteStudent(id) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cet élève?')) return;

            const transaction = db.transaction(['students', 'grades'], 'readwrite');
            transaction.objectStore('students').delete(id);
            
            // Supprimer aussi les notes
            const gradesStore = transaction.objectStore('grades');
            const index = gradesStore.index('studentId');
            const request = index.openCursor(IDBKeyRange.only(id));
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                }
            };

            transaction.oncomplete = () => {
                loadStudentsList();
                updateStudentSelects();
            };
        }

        // Mettre à jour les selects d'élèves
        function updateStudentSelects() {
            const transaction = db.transaction(['students'], 'readonly');
            const store = transaction.objectStore('students');
            const request = store.getAll();

            request.onsuccess = () => {
                const students = request.result;
                const selects = [
                    document.getElementById('selectStudent'),
                    document.getElementById('selectStudentResults')
                ];

                selects.forEach(select => {
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">-- Choisir un élève --</option>';
                    students.forEach(student => {
                        const option = document.createElement('option');
                        option.value = student.id;
                        option.textContent = student.name;
                        select.appendChild(option);
                    });
                    select.value = currentValue;
                });
            };
        }

        // Charger les notes d'un élève
        function loadStudentGrades() {
            const studentId = parseInt(document.getElementById('selectStudent').value);
            if (!studentId) {
                document.getElementById('gradesContainer').innerHTML = '';
                return;
            }

            const transaction = db.transaction(['students', 'grades'], 'readonly');
            const studentsStore = transaction.objectStore('students');
            const gradesStore = transaction.objectStore('grades');

            studentsStore.get(studentId).onsuccess = (e) => {
                const student = e.target.result;
                const container = document.getElementById('gradesContainer');
                container.innerHTML = '';

                const sequences = ['Séquence 1', 'Séquence 2', 'Séquence 3', 'Séquence 4', 'Séquence 5', 'Séquence 6'];
                
                sequences.forEach((seqName, seqIndex) => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `<h3>${seqName}</h3>`;
                    
                    const grid = document.createElement('div');
                    grid.className = 'grades-grid';
                    
                    student.subjects.forEach((subject, subIndex) => {
                        const gradeInput = document.createElement('div');
                        gradeInput.className = 'grade-input';
                        gradeInput.innerHTML = `
                            <label>${subject.name} (Coef. ${subject.coefficient})</label>
                            <input type="number" min="0" max="20" step="0.5" 
                                   id="grade-${seqIndex}-${subIndex}" 
                                   placeholder="Note/20">
                        `;
                        grid.appendChild(gradeInput);
                    });
                    
                    card.appendChild(grid);
                    container.appendChild(card);
                });

                // Charger les notes existantes
                const index = gradesStore.index('studentId');
                index.get(studentId).onsuccess = (e) => {
                    const grades = e.target.result;
                    if (grades && grades.data) {
                        grades.data.forEach((seq, seqIndex) => {
                            seq.forEach((grade, subIndex) => {
                                const input = document.getElementById(`grade-${seqIndex}-${subIndex}`);
                                if (input) input.value = grade || '';
                            });
                        });
                    }
                };

                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn';
                saveBtn.textContent = 'Enregistrer les notes';
                saveBtn.onclick = saveGrades;
                container.appendChild(saveBtn);
            };
        }

        // Sauvegarder les notes
        function saveGrades() {
            const studentId = parseInt(document.getElementById('selectStudent').value);
            const transaction = db.transaction(['students', 'grades'], 'readwrite');
            const studentsStore = transaction.objectStore('students');
            
            studentsStore.get(studentId).onsuccess = (e) => {
                const student = e.target.result;
                const gradesData = [];

                for (let seq = 0; seq < 6; seq++) {
                    const seqGrades = [];
                    for (let sub = 0; sub < student.subjects.length; sub++) {
                        const input = document.getElementById(`grade-${seq}-${sub}`);
                        seqGrades.push(input.value ? parseFloat(input.value) : null);
                    }
                    gradesData.push(seqGrades);
                }

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
            };

            transaction.oncomplete = () => {
                alert('Notes enregistrées avec succès!');
            };
        }

        // Calculer les résultats
        function calculateResults() {
            const studentId = parseInt(document.getElementById('selectStudentResults').value);
            if (!studentId) {
                document.getElementById('resultsContainer').innerHTML = '';
                return;
            }

            const transaction = db.transaction(['students', 'grades'], 'readonly');
            const studentsStore = transaction.objectStore('students');
            const gradesStore = transaction.objectStore('grades');

            studentsStore.get(studentId).onsuccess = (e) => {
                const student = e.target.result;
                const index = gradesStore.index('studentId');
                
                index.get(studentId).onsuccess = (e) => {
                    const grades = e.target.result;
                    if (!grades || !grades.data) {
                        document.getElementById('resultsContainer').innerHTML = '<p>Aucune note disponible</p>';
                        return;
                    }

                    const results = computeAverages(student, grades.data);
                    displayResults(results);
                };
            };
        }

        // Calcul des moyennes
        function computeAverages(student, gradesData) {
            const sequences = [];
            const trimesters = [[], [], []];

            // Moyennes par séquence
            gradesData.forEach((seqGrades, index) => {
                let sum = 0;
                let coefSum = 0;
                
                seqGrades.forEach((grade, subIndex) => {
                    if (grade !== null) {
                        sum += grade * student.subjects[subIndex].coefficient;
                        coefSum += student.subjects[subIndex].coefficient;
                    }
                });
                
                const avg = coefSum > 0 ? sum / coefSum : null;
                sequences.push(avg);
                
                const trimester = Math.floor(index / 2);
                if (avg !== null) trimesters[trimester].push(avg);
            });

            // Moyennes par trimestre
            const trimesterAvgs = trimesters.map(trim => {
                if (trim.length === 0) return null;
                return trim.reduce((a, b) => a + b, 0) / trim.length;
            });

            // Moyenne générale
            const validTrims = trimesterAvgs.filter(t => t !== null);
            const yearAvg = validTrims.length > 0 
                ? validTrims.reduce((a, b) => a + b, 0) / validTrims.length 
                : null;

            return { sequences, trimesters: trimesterAvgs, year: yearAvg };
        }

        // Afficher les résultats
        function displayResults(results) {
            const container = document.getElementById('resultsContainer');
            container.innerHTML = '';

            // Séquences
            const seqCard = document.createElement('div');
            seqCard.className = 'card';
            seqCard.innerHTML = '<h3>Moyennes par séquence</h3>';
            results.sequences.forEach((avg, index) => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <span>Séquence ${index + 1}</span>
                    <span class="result-value">${avg !== null ? avg.toFixed(2) : 'N/A'}</span>
                `;
                seqCard.appendChild(item);
            });
            container.appendChild(seqCard);

            // Trimestres
            const trimCard = document.createElement('div');
            trimCard.className = 'card';
            trimCard.innerHTML = '<h3>Moyennes par trimestre</h3>';
            results.trimesters.forEach((avg, index) => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <span>Trimestre ${index + 1}</span>
                    <span class="result-value">${avg !== null ? avg.toFixed(2) : 'N/A'}</span>
                `;
                trimCard.appendChild(item);
            });
            container.appendChild(trimCard);

            // Moyenne générale
            const yearCard = document.createElement('div');
            yearCard.className = 'results';
            yearCard.innerHTML = `
                <h3>Moyenne Générale de l'Année</h3>
                <div class="result-item">
                    <span>Résultat final</span>
                    <span class="result-value">${results.year !== null ? results.year.toFixed(2) + '/20' : 'N/A'}</span>
                </div>
            `;
            container.appendChild(yearCard);
        }

        // Service Worker
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
                document.getElementById('status').textContent = '✓ PWA activée';
            }).catch(() => {
                document.getElementById('status').textContent = '⚠ Mode en ligne';
            });
        }

        // Initialisation
        window.addEventListener('load', () => {
            initDB();
            initDefaultSubjects();
        });

        // Détection en ligne/hors ligne
        window.addEventListener('online', () => {
            document.getElementById('status').textContent = '✓ En ligne';
        });

        window.addEventListener('offline', () => {
            document.getElementById('status').textContent = '⚠ Hors ligne';
        });