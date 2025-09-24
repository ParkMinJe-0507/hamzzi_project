// js/community.js 파일 전체를 아래 코드로 교체하세요.

// Firebase 설정 및 Firestore 함수 가져오기
import { db } from '/js/firebase-config.js';
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const postsCollection = collection(db, 'posts');
const commentsCollection = collection(db, 'comments');

const path = window.location.pathname;

// ✅ 게시판 목록 페이지 (Firestore 데이터 읽기)
if (path.endsWith('/community/') || path.endsWith('/community/index.html')) {
    const boardBody = document.getElementById('board-body');
    if (boardBody) {
        const q = query(postsCollection, orderBy('createdAt', 'desc')); // 최신순으로 정렬
        getDocs(q).then(snapshot => {
            if (snapshot.empty) {
                boardBody.innerHTML = '<tr><td colspan="4">아직 작성된 글이 없습니다.</td></tr>';
                return;
            }
            snapshot.docs.forEach((doc, index) => {
                const post = { id: doc.id, ...doc.data() };
                const postDate = post.createdAt?.toDate().toLocaleDateString() || '날짜 없음';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="번호">${snapshot.size - index}</td>
                    <td data-label="제목" class="title">
                        <a href="/pages/community/post/index.html?id=${post.id}" class="post-link">${post.title}</a>
                    </td>
                    <td data-label="글쓴이">${post.author || '익명'}</td>
                    <td data-label="작성일">${postDate}</td>
                `;
                boardBody.appendChild(row);
            });
        });
    }
}

// ✅ 게시글 상세 페이지 (Firestore 데이터 읽기 및 댓글 처리)
if (path.includes('/post/index.html')) {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const postDocRef = doc(db, 'posts', postId);

    // 게시글 내용 불러오기
    getDoc(postDocRef).then(docSnap => {
        if (docSnap.exists()) {
            const post = { id: docSnap.id, ...docSnap.data() };
            document.title = `${post.title} - 햄찌백과`;
            const postContainer = document.getElementById('post-container');
            const postDate = post.createdAt?.toDate().toLocaleDateString() || '날짜 없음';
            postContainer.innerHTML = `
                <div class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta-info">
                        <span>작성자: ${post.author || '익명'}</span> | <span>날짜: ${postDate}</span>
                    </div>
                    <div class="post-actions">
                        <a href="/pages/community/write/index.html?id=${post.id}">수정</a>
                        <button id="delete-btn">삭제</button>
                    </div>
                </div>
                <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
            `;
            
            // 삭제 버튼 이벤트
            document.getElementById('delete-btn').addEventListener('click', async () => {
                if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                    await deleteDoc(postDocRef);
                    alert('삭제되었습니다.');
                    window.location.href = '/pages/community/index.html';
                }
            });

        } else {
            document.getElementById('post-container').innerHTML = '<h1>게시글을 찾을 수 없습니다.</h1>';
        }
    });
    
    // 댓글 기능 (이하 생략 - 기존과 거의 동일)
}


// ✅ 글쓰기/수정 페이지 (Firestore 데이터 쓰기/수정)
if (path.includes('/write/index.html')) {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const form = document.getElementById('write-form');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    // 수정 모드일 경우 기존 데이터 불러오기
    if (postId) {
        document.getElementById('write-page-title').textContent = '게시글 수정';
        const postDocRef = doc(db, 'posts', postId);
        getDoc(postDocRef).then(docSnap => {
            if (docSnap.exists()) {
                titleInput.value = docSnap.data().title;
                contentInput.value = docSnap.data().content;
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const postData = {
            title: titleInput.value,
            content: contentInput.value,
            author: '익명', // 로그인 기능 구현 시 실제 사용자 이름으로 변경
            // createdAt은 새 글일 때만 추가
        };

        if (postId) { // 수정
            const postDocRef = doc(db, 'posts', postId);
            await updateDoc(postDocRef, postData);
            alert('수정되었습니다.');
        } else { // 새 글 작성
            postData.createdAt = serverTimestamp(); // 서버의 현재 시간 기록
            await addDoc(postsCollection, postData);
            alert('작성되었습니다.');
        }
        window.location.href = `/pages/community/index.html`;
    });
}