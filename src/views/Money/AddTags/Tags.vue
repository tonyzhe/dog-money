<template>
  <div class="tags">
    <div class="fixed">
      <header class="header">
        <div class="title">
          <button class="back">
            <Icon name="left"></Icon>
          </button>
          <span>添加支出类别</span>
        </div>
        <button>
          <icon name="done"></icon>
        </button>
      </header>
      <div class="selectedTag">
        <div class="label">
          <span>选中的标签:</span>
          <div class="selectedIcon">
            <Icon :name="initTag.name"/>
          </div>
        </div>

        <span>{{ initTag.value }}</span>
      </div>
    </div>
    <div class="content">
      <div v-for="item in tagList" :key="item.value">
        <div class="kind-name">{{ item.value }}</div>

        <tag-list :selected-tag.sync="initTag"
                  :tag-list="item
                  .relatedTag"
                  icon-class="tagsClass"
                  class-prefix="main"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Icon from '@/components/Icon.vue';
import {expendTagItem, TagItem} from '@/custom';
import TagList from '@/components/Money/TagList.vue';

@Component({
  components: {TagList, Icon}
})
export default class Tags extends Vue {
  initTag: TagItem = {name: 'food', value: '餐饮'};


  get tagList(): expendTagItem[] {
    return this.$store.state.tagList;
  }
}
</script>

<style lang="scss" scoped>
@mixin icon($color) {
  background: #fff;
  border: 1px solid transparent;
  color: $color;
  &.selected {
    border: 1px solid $color
  }
}

::v-deep {
  .main-tags {
    li:nth-child(4n+0) {
      .tags-item-icon {
        @include icon(#a4d09f)
      }
    }

    li:nth-child(4n+1) {
      .tags-item-icon {
        @include icon(#f7d680)
      }
    }

    li:nth-child(4n+2) {
      .tags-item-icon {
        @include icon(#b84e52)
      }
    }

    li:nth-child(4n+3) {
      .tags-item-icon {
        @include icon(#5079c8)
      }
    }
  }
}

.tags {
  .fixed {
    font-size: 20px;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: #fff;

    .header {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;

      background: pink;

      .title {
        display: flex;
        justify-content: center;
        align-items: center;

        .back {
          margin-right: 8px;
        }
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .selectedTag {
      padding: 6px 18px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: inset 0 -1px 1px -1px rgb(0 0 0 / 30%);

      .label {
        display: flex;
        align-items: center;

        .selectedIcon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #ffb8e7;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 8px;

          svg {
            width: 24px;
            height: 24px;
          }

        }
      }


    }
  }

  .content {
    padding-top: 118px;

    .kind-name {
      font-size: 14px;
      color: #999;
      text-align: center;
    }

    ::v-deep .tagsClass-icons {
      width: 24px;
      height: 24px;
      //color: red;
    }


  }
}
</style>
