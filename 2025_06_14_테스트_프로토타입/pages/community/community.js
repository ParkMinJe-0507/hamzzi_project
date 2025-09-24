document.addEventListener('DOMContentLoaded', () => {
    // 임시 데이터 (실제로는 서버에서 받아와야 함)
    let posts = JSON.parse(localStorage.getItem('posts')) || [
        { id: 1, title: '햄스터가 계속 숨기만 해요 😢', content: '저희 집 햄스터가 자꾸 숨어만 있어요. 어떻게 해야 친해질 수 있을까요?', author: '햄찌초보', date: '2025-06-14' },
        { id: 2, title: '먹이면 안 되는 음식 정리', content: '초콜릿, 사탕, 마늘 등 햄스터에게 해로운 음식 목록입니다.', author: '햄스터박사', date: '2025-06-13' }
    ];
    let comments = JSON.parse(localStorage.getItem('comments')) || [];

    const path = window.location.pathname;

    // 게시판 목록 페이지
    if (path.includes('community.html')) {
        const postList = document.getElementById('post-list');
        posts.forEach(post => {
            const postLink = document.createElement('a');
            postLink.href = `post.html?id=${post.id}`;
            postLink.className = 'post-item';
            postLink.innerHTML = `
                <div>
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">작성자: ${post.author} | 날짜: ${post.date}</div>
                </div>
            `;
            postList.appendChild(postLink);
        });
    }

    // 게시글 상세 페이지
    if (path.includes('post.html')) {
        const params = new URLSearchParams(window.location.search);
        const postId = parseInt(params.get('id'));
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            document.title = `${post.title} - 햄찌백과`;
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = `
                <div class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta-info">
                        <span>작성자: ${post.author}</span> | <span>날짜: ${post.date}</span>
                    </div>
                    <div class="post-actions">
                        <a href="write.html?id=${post.id}">수정</a>
                        <button id="delete-btn">삭제</button>
                    </div>
                </div>
                <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
            `;

            // 삭제 기능
            document.getElementById('delete-btn').addEventListener('click', () => {
                if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                    posts = posts.filter(p => p.id !== postId);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    window.location.href = 'community.html';
                }
            });

            // 댓글 기능
            const commentList = document.getElementById('comment-list');
            const postComments = comments.filter(c => c.postId === postId);
            postComments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = `<div class="comment-author">${comment.author}</div><p class="comment-content">${comment.content}</p>`;
                commentList.appendChild(commentDiv);
            });

            document.getElementById('comment-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const commentInput = document.getElementById('comment-input');
                const newComment = {
                    id: Date.now(),
                    postId: postId,
                    author: '익명', // 로그인 기능 구현 시 변경
                    content: commentInput.value
                };
                comments.push(newComment);
                localStorage.setItem('comments', JSON.stringify(comments));
                commentInput.value = '';
                location.reload(); // 간단하게 새로고침으로 처리
            });
        }
    }

    // 글쓰기/수정 페이지
    if (path.includes('write.html')) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id') ? parseInt(params.get('id')) : null;
        const form = document.getElementById('write-form');
        const titleInput = document.getElementById('title');
        const contentInput = document.getElementById('content');

        if (postId) { // 수정 모드
            const post = posts.find(p => p.id === postId);
            if (post) {
                document.getElementById('write-page-title').textContent = '게시글 수정';
                titleInput.value = post.title;
                contentInput.value = post.content;
            }
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (postId) { // 수정
                const postIndex = posts.findIndex(p => p.id === postId);
                posts[postIndex].title = titleInput.value;
                posts[postIndex].content = contentInput.value;
            } else { // 새 글 작성
                const newPost = {
                    id: Date.now(),
                    title: titleInput.value,
                    content: contentInput.value,
                    author: '익명', // 로그인 기능 구현 후 변경
                    date: new Date().toISOString().slice(0, 10)
                };
                posts.push(newPost);
            }
            localStorage.setItem('posts', JSON.stringify(posts));
            window.location.href = `community.html`;
        });
    }
});