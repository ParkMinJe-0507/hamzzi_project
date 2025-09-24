// js/auth.js

// Firebase 설정 및 인증 함수 가져오기
import { auth } from '/js/firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const path = window.location.pathname;

// ### 회원가입 페이지 로직 ###
if (path.includes('/sign_up/')) {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const passwordConfirm = signupForm['password-confirm'].value;

        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // 회원가입 성공
                alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
                window.location.href = '/pages/login/sign_in/index.html';
            })
            .catch((error) => {
                // 회원가입 실패
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Signup Error:", errorCode, errorMessage);
                if (errorCode === 'auth/email-already-in-use') {
                    alert('이미 사용 중인 이메일입니다.');
                } else {
                    alert('회원가입에 실패했습니다: ' + errorMessage);
                }
            });
    });
}

// ### 로그인 페이지 로직 ###
if (path.includes('/sign_in/')) {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // 로그인 성공
                alert('로그인 되었습니다!');
                window.location.href = '/index.html'; // 홈페이지로 이동
            })
            .catch((error) => {
                // 로그인 실패
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Login Error:", errorCode, errorMessage);
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                    alert('이메일 또는 비밀번호가 잘못되었습니다.');
                } else {
                    alert('로그인에 실패했습니다: ' + errorMessage);
                }
            });
    });
}