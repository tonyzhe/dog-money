<template>
  <div class="edit">
    <header class="header">
      <button class="back">
        <icon name="back" class-prefix="back"/>
      </button>
      <div class="tag">
        <icon name="food"/>
        <span>餐饮</span>
      </div>
      <div class="last"></div>
    </header>
    <main>
      <ul>
        <li>
          <label>
            <span>类型</span>
            <span class="type">{{ record.type === '-' ? '支出' : '收入' }}</span>
          </label>
        </li>
        <li>
          <label>
            <span>金额</span>
            <input type="text" v-model="record.amount" placeholder="金额">
          </label>
        </li>
        <li>
          <label class="date">
            <span>日期</span>
            <date-picker :initial-date.sync="record.createAt"/>
          </label>
        </li>
        <li>
          <label>
            <span>备注</span>
            <input type="text" v-model="record.note">
          </label>
        </li>
      </ul>
    </main>
    {{ record }}
    <footer>
      <button @click="ok">完 成</button>
      <button @click="remove">删 除</button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';
import DatePicker from '@/components/Bill/DatePicker.vue';
import {RecordItem} from '@/custom';
import dayjs from 'dayjs';
import clone from '@/lib/clone';

@Component({
  components: {DatePicker, Icon}
})
export default class RecordEdit extends Vue {
  record!: RecordItem;
  dayjs = dayjs;

  created(): void {
    this.$store.commit('findRecord', parseInt(this.$route.params.id));
    this.record = clone<RecordItem>(this.$store.state.currentRecord);
  }

  ok(): void {
    this.record.amount = parseInt(this.record.amount.toString());
    this.$store.commit('updateRecord', {id: this.record.id, record: this.record});
    this.$router.replace('/');
  }

  remove(): void {
    console.log('ok');
  }

  // ok()

  // remove()
}
</script>

<style lang="scss" scoped>
.edit {
  .header {
    background: pink;
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;

    .back {
      ::v-deep {
        .back-icons {
          height: 24px;
          width: 24px;
        }
      }
    }

    .last {
      width: 24px;
      height: 24px;
    }

    .tag {
      font-size: 14px;

      svg {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        background: #fff;
        padding: 3px;
        margin-bottom: 5px;
      }

      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  main {
    li {
      margin-left: 16px;
      padding: 12px 16px;
      border-bottom: 1px solid #dddddd;
      color: #999999;

      > label {
        line-height: 40px;

        > span {
          margin-right: 16px;

          &.type {
            color: black;
          }

        }

        > input {
          font-size: 16px;
        }

        &.date {
          display: flex;
        }
      }
    }

  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #dddddd;


    button {
      width: 50%;
      font-size: 14px;
      padding: 5px 0;
      box-shadow: 1px 0 -1px 1px rgba(0, 0, 0, .6);
      margin: 8px 0;

      &:first-child {
        position: relative;

        &::after {
          content: ' ';
          position: absolute;
          height: 100%;
          width: 1px;
          background: #dddddd;
          right: 0;
          bottom: 50%;
          transform: translateY(50%);
        }
      }

      &:last-child {
        color: red;
      }
    }
  }
}
</style>
