<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import NumberBlock from './NumberBlock.vue'

let uid = 0

const grid = [[], [], [], []] as any[]
const numberList = ref([] as any[]).value

// 计分
const score = ref(0)
function addScore(num: number) {
  score.value += num
}

// 初始化游戏
function initGame() {
  uid = 0
  score.value = 0
  grid.forEach((v, i) => {
    grid[i] = []
  })
  numberList.length = 0
  random()
  random()
}

// 随机选中一个空位置
function random() {
  let num = Math.floor(Math.random() * 16)
  while (num > -1) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!grid[i][j]) {
          if (num === 0)
            return createNumber(i, j)
          num--
        }
      }
    }
  }
}
// 创建number
function createNumber(x: number, y: number) {
  const number = ref({
    x,
    y,
    number: 1,
    uid: ++uid,
  }).value
  grid[x][y] = number
  numberList.push(number)
}
// 移除number
function removeNumber(i: number) {
  numberList.splice(i, 1)
}

/*
 * 对与用户操作，如果用户操作“上”，那么需要从上往下遍历，操作“左”就从左往右遍历
 */
function up() {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++)
      move(i, j, 'up')
  }
}
function down() {
  for (let i = 2; i >= 0; i--) {
    for (let j = 0; j < 4; j++)
      move(i, j, 'down')
  }
}
function left() {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++)
      move(i, j, 'left')
  }
}
function right() {
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--)
      move(i, j, 'right')
  }
}

function move(x: number, y: number, dir: string) {
  const self = grid[x][y]
  if (!self)
    return

  grid[x][y] = undefined
  if (dir === 'up') {
    while (x-- > 0) {
      if (moveTo(self, x, y) === false)
        break
    }
  }
  else if (dir === 'down') {
    while (x++ < 3) {
      if (moveTo(self, x, y) === false)
        break
    }
  }
  else if (dir === 'left') {
    while (y-- > 0) {
      if (moveTo(self, x, y) === false)
        break
    }
  }
  else if (dir === 'right') {
    while (y++ < 3) {
      if (moveTo(self, x, y) === false)
        break
    }
  }
  if (!self._delete)
    grid[self.x][self.y] = self
}

let _moved = false // 是否移动过
function moveTo(self: any, x: number, y: number) {
  // 判断下一格是否能移动，以及是否合并
  if (grid[x][y]) {
    if (grid[x][y].number === self.number) {
      self.x = x
      self.y = y
      self._delete = true
      grid[x][y].number *= 2
      addScore(grid[x][y].number)
      _moved = true
    }
    return false
  }
  else {
    self.x = x
    self.y = y
    _moved = true
    return true
  }
}

function update() {
  if (_moved) {
    _moved = false
    random()
  }
  else {
    isEnded()
  }
}
function isEnded() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!grid[i][j])
        return
    }
  }
  // eslint-disable-next-line no-alert
  alert(`您的得分是：${score.value}分`)
}

function listener(e: KeyboardEvent) {
  switch (e.keyCode) {
    case 38:
    case 87:
      up()
      break
    case 40:
    case 83:
      down()
      break
    case 37:
    case 65:
      left()
      break
    case 39:
    case 68:
      right()
      break
    default:
      return true
  }
  e.preventDefault()
  update()
  return false
}

onMounted(() => {
  initGame()
  window.addEventListener('keydown', listener)
})

onUnmounted(() => {
  window.removeEventListener('keydown', listener)
})
</script>

<template>
  <div>
    <div class="title my-2">
      总分： {{ score }}
    </div>
    <div class="game">
      <!-- 背景布局 -->
      <div class="game-bg">
        <div v-for="i in 16" :key="i" class="item" />
      </div>

      <div class="canvas">
        <NumberBlock
          v-for="(v, i) in numberList"
          :key="v.uid"
          :item="v"
          @remove="removeNumber(i)"
        />
      </div>
      <h3 class="title mt-4">
        使用键盘方向键控制
      </h3>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  text-align: center;
  color: #776e65;
  font-size: 50px;
  font-weight: bold;
}

.game {
  position: relative;
}

.game-bg {
  display: grid;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: repeat(4, 100px);
  grid-gap: 10px;
  border: 10px solid #bcaca0;
  background: #bcaca0;
  border-radius: 10px;
}
.item {
  width: 100px;
  height: 100px;
  background: #ccc1b4;
  border-radius: 5px;
}

.canvas {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
