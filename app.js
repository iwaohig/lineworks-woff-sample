// LINE WORKS WOFF Sample Application

// 設定定数
const CONFIG = {
    WOFF_ID: "qu0wS6G52ulDhXL1xPFB5Q", // 実際のWOFF IDに設定済み
    API_ENDPOINT: "YOUR_API_ENDPOINT_HERE", // 実際のAPIエンドポイントに置き換えてください
    DEBUG_MODE: true
};

// アプリケーション状態管理
let appState = {
    initialized: false,
    loggedIn: false,
    inClient: false,
    profile: null,
    accessToken: null
};

// DOMContentLoadedイベントリスナー
document.addEventListener("DOMContentLoaded", function() {
    initializeWoffApp();
    setupEventListeners();
    updateDebugInfo();
});

// WOFF アプリの初期化
async function initializeWoffApp() {
    try {
        logDebug("WOFF アプリケーションの初期化を開始します...");
        
        // WOFF_ID の検証
        if (CONFIG.WOFF_ID === "YOUR_WOFF_ID_HERE") {
            showMessage("警告: WOFF_ID が設定されていません。app.js の CONFIG.WOFF_ID を実際の値に変更してください。", "error");
            return;
        }

        // WOFF SDK の初期化
        await woff.init({ woffId: CONFIG.WOFF_ID });
        appState.initialized = true;
        logDebug("WOFF SDK の初期化が完了しました");

        // ログイン状態とクライアント状態の確認
        appState.inClient = woff.isInClient();
        appState.loggedIn = woff.isLoggedIn();
        
        logDebug(`クライアント内: ${appState.inClient}, ログイン済み: ${appState.loggedIn}`);

        // ログインが必要な場合
        if (!appState.inClient && !appState.loggedIn) {
            showMessage("ログインが必要です。ログインを開始します...", "info");
            await woff.login();
        } else {
            // プロフィール情報の取得
            await loadProfile();
            // アクセストークンの取得
            getAccessToken();
        }

        updateDebugInfo();
        showMessage("アプリケーションの初期化が完了しました", "success");

    } catch (error) {
        logError("WOFF SDK の初期化に失敗しました:", error);
        showMessage(`初期化エラー: ${error.message}`, "error");
    }
}

// プロフィール情報の取得
async function loadProfile() {
    try {
        logDebug("プロフィール情報を取得中...");
        const profile = await woff.getProfile();
        appState.profile = profile;
        
        // UIに反映
        document.getElementById("displayNameInput").value = profile.displayName || "";
        document.getElementById("userIdInput").value = profile.userId || "";
        
        logDebug("プロフィール情報の取得が完了しました", profile);
        
    } catch (error) {
        logError("プロフィール情報の取得に失敗しました:", error);
        showMessage(`プロフィール取得エラー: ${error.message}`, "error");
    }
}

// アクセストークンの取得
function getAccessToken() {
    try {
        const token = woff.getAccessToken();
        if (token) {
            appState.accessToken = token;
            logDebug("アクセストークンの取得が完了しました");
        } else {
            logDebug("アクセストークンが取得できませんでした");
        }
    } catch (error) {
        logError("アクセストークンの取得に失敗しました:", error);
    }
}

// フォームの送信処理
async function submitForm() {
    try {
        logDebug("フォームの送信を開始します...");
        
        // フォームデータの取得
        const formData = getFormData();
        
        // バリデーション
        if (!validateFormData(formData)) {
            return;
        }

        // APIエンドポイントの確認
        if (CONFIG.API_ENDPOINT === "YOUR_API_ENDPOINT_HERE") {
            showMessage("API エンドポイントが設定されていません。実際の値に変更してください。", "error");
            return;
        }

        // ボタンを無効化
        const submitButton = document.querySelector('button[onclick="submitForm()"]');
        submitButton.disabled = true;
        submitButton.textContent = "送信中...";

        // APIへの送信
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': appState.accessToken ? `Bearer ${appState.accessToken}` : ''
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        logDebug("フォームの送信が完了しました", result);
        showMessage("来訪者情報が正常に登録されました", "success");
        
        // フォームをリセット
        resetForm();
        
        // WOFFアプリを閉じる（オプション）
        setTimeout(() => {
            closeApp();
        }, 2000);

    } catch (error) {
        logError("フォームの送信に失敗しました:", error);
        showMessage(`送信エラー: ${error.message}`, "error");
    } finally {
        // ボタンを再有効化
        const submitButton = document.querySelector('button[onclick="submitForm()"]');
        submitButton.disabled = false;
        submitButton.textContent = "登録";
    }
}

// フォームデータの取得
function getFormData() {
    const form = document.getElementById("visitorForm");
    const formData = new FormData(form);
    
    const data = {
        timestamp: new Date().toISOString(),
        userInfo: appState.profile,
        visitorName: formData.get("visitorName"),
        company: formData.get("company"),
        visitDateTime: formData.get("visitDateTime"),
        visitDetails: formData.get("visitDetails"),
        contactPerson: formData.get("contactPerson")
    };
    
    return data;
}

// フォームデータのバリデーション
function validateFormData(data) {
    if (!data.visitorName || data.visitorName.trim() === "") {
        showMessage("来訪者名は必須です", "error");
        return false;
    }
    
    if (!data.visitDateTime) {
        showMessage("訪問日時は必須です", "error");
        return false;
    }
    
    // 過去の日時チェック
    const visitDate = new Date(data.visitDateTime);
    const now = new Date();
    if (visitDate < now) {
        showMessage("過去の日時は指定できません", "error");
        return false;
    }
    
    return true;
}

// フォームのリセット
function resetForm() {
    document.getElementById("visitorForm").reset();
    updateCharacterCount();
    
    // デフォルト値の設定（1時間後）
    setDefaultDateTime();
}

// デフォルト日時の設定（1時間後）
function setDefaultDateTime() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + (60 * 60 * 1000));
    
    const year = oneHourLater.getFullYear();
    const month = ("0" + (oneHourLater.getMonth() + 1)).slice(-2);
    const day = ("0" + oneHourLater.getDate()).slice(-2);
    const hours = ("0" + oneHourLater.getHours()).slice(-2);
    const minutes = ("0" + oneHourLater.getMinutes()).slice(-2);
    
    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById("visitDateTime").value = dateTimeString;
}

// イベントリスナーの設定
function setupEventListeners() {
    // 文字数カウンター
    const textarea = document.getElementById('visitDetails');
    textarea.addEventListener('input', updateCharacterCount);
    
    // フォームの送信イベント
    const form = document.getElementById('visitorForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    // デフォルト日時の設定
    setDefaultDateTime();
}

// 文字数カウンターの更新
function updateCharacterCount() {
    const textarea = document.getElementById('visitDetails');
    const maxLength = 255;
    const currentLength = textarea.value.length;
    const characterCount = document.getElementById('characterCount');
    characterCount.textContent = `${currentLength}/${maxLength}`;
    
    // 文字数が上限に近づいたら警告色に変更
    if (currentLength > maxLength * 0.9) {
        characterCount.style.color = '#ff6b6b';
    } else {
        characterCount.style.color = '#666';
    }
}

// プロフィール情報の更新
async function refreshProfile() {
    try {
        if (!appState.initialized) {
            showMessage("アプリケーションが初期化されていません", "error");
            return;
        }
        
        await loadProfile();
        showMessage("プロフィール情報を更新しました", "success");
        
    } catch (error) {
        logError("プロフィール更新に失敗しました:", error);
        showMessage(`プロフィール更新エラー: ${error.message}`, "error");
    }
}

// アプリを閉じる
function closeApp() {
    try {
        if (typeof woff !== 'undefined' && woff.closeWindow) {
            woff.closeWindow();
        } else {
            window.close();
        }
    } catch (error) {
        logError("アプリの終了に失敗しました:", error);
        showMessage("アプリを手動で閉じてください", "info");
    }
}

// デバッグ情報の更新
function updateDebugInfo() {
    document.getElementById("woffIdDisplay").textContent = CONFIG.WOFF_ID;
    document.getElementById("loginStatus").textContent = appState.loggedIn ? "ログイン済み" : "未ログイン";
    document.getElementById("clientStatus").textContent = appState.inClient ? "はい" : "いいえ";
}

// メッセージ表示
function showMessage(message, type = "info") {
    // 既存のメッセージを削除
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // 新しいメッセージを作成
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // メッセージを挿入
    const container = document.querySelector('.container main');
    container.insertBefore(messageElement, container.firstChild);
    
    // 5秒後に自動削除
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
    
    logDebug(`Message [${type}]: ${message}`);
}

// デバッグログ
function logDebug(message, data = null) {
    if (CONFIG.DEBUG_MODE) {
        console.log(`[WOFF Sample] ${message}`, data);
    }
}

// エラーログ
function logError(message, error) {
    console.error(`[WOFF Sample Error] ${message}`, error);
}

// エクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        appState,
        validateFormData,
        getFormData
    };
}