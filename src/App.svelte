<script>
  import { onMount, onDestroy } from "svelte";

  // 状态变量
  let isRunning = false;
  let isWorking = true;
  let remainingTime = 25 * 60; // 默认25分钟
  let totalTime = 25 * 60;
  let currentTask = "专注工作";
  let taskInput = "";
  let showTaskInput = false;

  // 配置
  const workTime = 25 * 60; // 25分钟（秒）
  const restTime = 5 * 60; // 5分钟（秒）

  let timer;
  let progressInterval;

  // 格式化时间显示
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // 开始/暂停计时器
  function toggleTimer() {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  // 开始计时器
  function startTimer() {
    isRunning = true;
    const startTime = Date.now();
    const pausedAt = Date.now() - (totalTime - remainingTime) * 1000;

    timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - pausedAt) / 1000);
      remainingTime = totalTime - elapsed;

      if (remainingTime <= 0) {
        completeCycle();
      }
    }, 1000);
  }

  // 暂停计时器
  function pauseTimer() {
    isRunning = false;
    if (timer) {
      clearInterval(timer);
    }
  }

  // 重置计时器
  function resetTimer() {
    pauseTimer();
    isWorking = true;
    remainingTime = workTime;
    totalTime = workTime;
    currentTask = "专注工作";
  }

  // 完成一个循环
  function completeCycle() {
    pauseTimer();

    // 切换状态
    if (isWorking) {
      // 工作结束，切换到休息
      isWorking = false;
      remainingTime = restTime;
      totalTime = restTime;
      currentTask = "休息一下";
      playSound("rest");
    } else {
      // 休息结束，切换到工作
      isWorking = true;
      remainingTime = workTime;
      totalTime = workTime;
      currentTask = "专注工作";
      playSound("work");
    }

    // 简单的视觉反馈
    showNotification();
  }

  // 播放提示音
  function playSound(type) {
    // 这里可以添加音频播放逻辑
    console.log(`${type} sound played`);
  }

  // 显示通知
  function showNotification() {
    // 简单的视觉反馈
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 animate-bounce-in";
    notification.textContent = isWorking ? "开始工作！" : "休息时间！";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // 编辑任务
  function editTask() {
    taskInput = currentTask;
    showTaskInput = true;
    setTimeout(() => {
      const input = document.getElementById("task-input");
      if (input) input.focus();
    }, 0);
  }

  // 保存任务
  function saveTask() {
    if (taskInput.trim()) {
      currentTask = taskInput.trim();
    }
    showTaskInput = false;
  }

  // 取消编辑任务
  function cancelEditTask() {
    showTaskInput = false;
  }

  // 计算进度环参数
  const radius = 120;
  const circumference = radius * 2 * Math.PI;
  $: progress = remainingTime / totalTime;
  $: strokeDashoffset = circumference - progress * circumference;

  // 组件挂载和卸载
  onMount(() => {
    // 初始化
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<main
  class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4"
>
  <!-- 主计时器区域 -->
  <div class="max-w-md w-full mx-auto flex flex-col items-center">
    <!-- 环形进度条 -->
    <div class="relative mb-8">
      <svg
        class="w-[300px] h-[300px] transform -rotate-90"
        viewBox="0 0 300 300"
      >
        <!-- 背景圆环 -->
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          stroke-width="12"
        />
        <!-- 进度圆环 -->
        <circle
          class="progress-ring-circle"
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={isWorking ? "rgb(249, 115, 22)" : "rgb(34, 197, 94)"}
          stroke-width="12"
          stroke-linecap="round"
        />
      </svg>

      <!-- 时间显示 -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div
          class={`text-6xl font-bold text-gray-800 dark:text-white ${isRunning ? "animate-pulse" : ""}`}
        >
          {formatTime(remainingTime)}
        </div>
        <div class="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {isWorking ? "工作时间" : "休息时间"}
        </div>
      </div>
    </div>

    <!-- 任务显示 -->
    <div class="mb-8 w-full">
      {#if showTaskInput}
        <div class="flex items-center gap-2">
          <input
            id="task-input"
            bind:value={taskInput}
            on:keydown={(e) => e.key === "Enter" && saveTask()}
            on:keydown={(e) => e.key === "Escape" && cancelEditTask()}
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            placeholder="输入任务名称"
          />
          <button
            on:click={saveTask}
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            保存
          </button>
          <button
            on:click={cancelEditTask}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
        </div>
      {:else}
        <button
          type="button"
          class="flex justify-between items-center w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:scale-102 transition-transform"
          on:click={editTask}
        >
          <span class="text-lg text-gray-800 dark:text-white"
            >{currentTask}</span
          >
          <svg
            class="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      {/if}
    </div>

    <!-- 控制按钮 -->
    <div class="flex gap-4">
      <button
        on:click={toggleTimer}
        class={`px-8 py-3 rounded-full font-medium transition-all ${isRunning ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-white hover:bg-primary/90"} hover:scale-105 active:scale-95`}
      >
        {isRunning ? "暂停" : "开始"}
      </button>
      <button
        on:click={resetTimer}
        class="px-8 py-3 rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-105 active:scale-95"
      >
        重置
      </button>
    </div>
  </div>
</main>
