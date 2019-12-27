<template>
  <v-content class="pa-0 fill-height" id="event-container">
    <v-app-bar
      app
      clipped-left
      clipped-right
      dense
      flat
      style="border-bottom: 1px solid rgba(0, 0, 0, .12);"
    >
      <v-app-bar-nav-icon @click="handleDrawer"/>
      <v-toolbar-title>活动标题</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items>
        <v-list-item>
          <v-list-item-title>
            剩余 99:99:99
          </v-list-item-title>
        </v-list-item>
      </v-toolbar-items>
      <v-spacer/>
      <v-toolbar-items>
        <v-list-item link>
          <v-list-item-title>
            <v-icon>mdi-camera</v-icon>
            <v-icon>mdi-chevron-down</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-btn text>
          <v-icon class="mr-2">mdi-account</v-icon>
          2021234567 AAAA
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-bottom-navigation
      app
    >
      <v-btn @click.stop="problemControl('prev')">
        <span>上一题</span>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn v-show="!currentProblem.marked" @click.stop="handleMarkProblem">
        <span>标记本题</span>
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
      <v-btn v-show="currentProblem.marked" @click.stop="handleUnmarkProblem">
        <span>取消标记</span>
        <v-icon>mdi-bookmark-check</v-icon>
      </v-btn>
      <v-btn @click.stop="handleRefresh">
        <span>刷新题目</span>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn @click.stop="problemControl('next')">
        <span>下一题</span>
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
      <v-spacer/>

      <v-dialog v-model="handInPromptVisible" persistent max-width="480px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">
            <span>交卷</span>
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">确认交卷吗？</v-card-title>
          <v-card-text>交卷后，你将无法提交答案或修改已提交的答案。</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              :disabled="handingIn"
              @click="handInPromptVisible = false">
              <span v-if="handingIn">正在交卷</span><span v-else>点错了，不交</span>
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              :disabled="handingIn"
              :loading="handingIn"
              @click="handleHandIn">
              确认交卷
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-bottom-navigation>
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      :mini-variant="drawer === 1"
      mini-variant-width="120"
    >
      <v-list-item v-show="drawer === 2">
        <v-list-item-action-text>图例</v-list-item-action-text>
        <v-list-item-action>
          <v-row>
            <v-chip small>未答</v-chip>
            <v-chip small class="problem-chip-answered">已答</v-chip>
            <v-chip small class="problem-chip-marked">已标记</v-chip>
          </v-row>
        </v-list-item-action>
      </v-list-item>
      <v-divider v-show="drawer === 2"/>
      <v-list v-show="drawer !== 2">
        <v-menu offset-x v-for="(s, idx) of problemSets" :key="'mini-set-' + s.title">
          <template v-slot:activator="{ on }">
            <v-list-item v-on="on">
              <v-list-item-title>
                {{s.title}} >
              </v-list-item-title>
            </v-list-item>
          </template>
          <v-list>
            <v-chip-group
              class="pl-2"
              column
              active-class="primary--text"
              v-model="currentProblemIndex[idx]"
            >
              <v-chip v-for="(p, i) in s.problems" :key="i"
                      @click="handleSwitchProblem(idx, i)"
                      :class="(p.answered?'problem-chip-answered ':'') + (p.marked?'problem-chip-marked':'')"
              >{{i + 1}}</v-chip>
            </v-chip-group>
          </v-list>
        </v-menu>
      </v-list>
      <v-list v-show="drawer === 2">
        <v-list-item v-for="(s, idx) of problemSets" :key="'set-' + s.title">
          <v-row class="pl-2">
            <v-subheader class="pl-0">{{s.title}}</v-subheader>
            <v-chip-group
              column
              active-class="primary--text"
              v-model="currentProblemIndex[idx]"
            >
              <v-chip v-for="(p, i) in s.problems" :key="i"
                      @click.stop="handleSwitchProblem(idx, i)"
                      :class="(p.answered?'problem-chip-answered ':'') + (p.marked?'problem-chip-marked':'')"
              >{{i + 1}}</v-chip>
            </v-chip-group>
          </v-row>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="6">
        <v-sheet tile id="problem-sheet">
          <v-system-bar
            color="grey lighten-2"
          >
            <span>{{currentProblemSetTitle}} - 第{{currentProblemSelection.idx + 1}}题</span>
          </v-system-bar>
          <v-container id="problem-container">
            <h1 class="font-weight-light">题目blablabla</h1>
            <v-row justify="start" align="start">
              <v-col cols="12">
                <h2 class="font-weight-light">背景</h2>
                <markdown-it-vue :content="code"/>
              </v-col>
              <v-col cols="12">
                <h2 class="font-weight-light">描述</h2>
                <markdown-it-vue :content="code"/>
              </v-col>
              <v-col cols="12">
                <h2 class="font-weight-light">输入格式</h2>
                <markdown-it-vue :content="code"/>
              </v-col>
              <v-col cols="12">
                <h2 class="font-weight-light">输出格式</h2>
                <markdown-it-vue :content="code"/>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="6">
        <v-sheet id="answer-sheet" tile>
          <v-system-bar
            color="grey lighten-4"
          >
            <span>答题区域</span>
          </v-system-bar>
          <v-container v-show="false" class="fill-height pa-0">
            <v-navigation-drawer
              v-model="rightDrawer"
              absolute
              temporary
              right
            >
              <v-list-item>AAAAAA</v-list-item>
            </v-navigation-drawer>
            <v-toolbar dense class="pa-0">
              <v-toolbar-items>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                      {{language ? language.label : '选择语言'}} <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(l, i) of languageList"
                      :key="l.name"
                      @click="handleSwitchLanguage(i)"
                    >
                      <v-list-item-title>
                        {{l.label}}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar-items>
              <v-spacer/>
              <v-toolbar-items>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-help</v-icon>
                    </v-btn>
                  </template>
                  <span>编辑器使用说明</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-test-tube</v-icon>
                    </v-btn>
                  </template>
                  <span>测试</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                  <span>提交</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn icon v-on="on"
                           @click="rightDrawer = !rightDrawer">
                      <v-icon>mdi-history</v-icon>
                    </v-btn>
                  </template>
                  <span>提交历史</span>
                </v-tooltip>
              </v-toolbar-items>
            </v-toolbar>
            <v-row no-gutters class="fill-height">
              <v-col cols="12">
                <codemirror class="fill-height" :options="cmOptions"/>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-content>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
// @ts-ignore
import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css'
import {vxm} from '@/store'
// @ts-ignore
import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// language
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/clike/clike.js'

// theme css
import 'codemirror/theme/solarized.css'
// require active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'
// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/selection/active-line.js'
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'
// keyMap
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'
// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

interface ProblemSet {
  title: string;
  problems: ProblemEntry[];
}

interface ProblemEntry {
  id: number;
  marked: boolean;
  answered: boolean;
}

interface AnswerSheet {
  id: number;
  userId: number;
  answers: unknown;
}

interface ProblemSelection {
  set: number;
  idx: number;
}
@Component({
  components: {
    MarkdownItVue,
    codemirror
  }
})
export default class Event extends Vue {
  // 0 => hidden, 1 => narrow, 2 => full
  drawer: number = 2;
  rightDrawer: boolean = false;
  currentProblemIndex: number[] = [];
  currentProblemSelection: ProblemSelection = {
    set: 0,
    idx: 0
  };
  handInPromptVisible: boolean = false;
  handingIn: boolean = false;
  language: object | null = null;

  problemSets: ProblemSet[] = [
    {
      title: '单选题',
      problems: [
        { id: 1, marked: false, answered: false },
        { id: 2, marked: false, answered: true },
        { id: 3, marked: false, answered: true },
        { id: 4, marked: false, answered: true },
        { id: 5, marked: true, answered: false },
        { id: 6, marked: true, answered: false },
        { id: 7, marked: true, answered: false },
        { id: 8, marked: true, answered: true },
        { id: 9, marked: true, answered: true },
        { id: 10, marked: false, answered: false },
        { id: 31, marked: false, answered: false },
        { id: 32, marked: false, answered: false },
        { id: 33, marked: false, answered: false },
        { id: 34, marked: false, answered: false },
        { id: 35, marked: false, answered: false },
        { id: 36, marked: false, answered: false },
        { id: 37, marked: false, answered: false },
        { id: 38, marked: false, answered: false },
        { id: 39, marked: false, answered: false },
        { id: 40, marked: false, answered: false },
      ]
    },
    {
      title: '多选题',
      problems: [
        { id: 11, marked: false, answered: false },
        { id: 21, marked: false, answered: false },
        { id: 31, marked: false, answered: false },
        { id: 41, marked: false, answered: false },
        { id: 51, marked: false, answered: false },
        { id: 61, marked: false, answered: false },
        { id: 71, marked: false, answered: false },
        { id: 81, marked: false, answered: false },
        { id: 91, marked: false, answered: false },
        { id: 101, marked: false, answered: false },
      ]
    }
  ];

  get currentProblemSetTitle(): string {
    if (this.currentProblemSelection.set >= 0) {
      return this.problemSets[this.currentProblemSelection.set].title;
    }
    else return '';
  }

  get currentProblem(): ProblemEntry {
    return this.problemSets[this.currentProblemSelection.set].problems[this.currentProblemSelection.idx];
  }

  languageList: object[] = [
    {
      name: 'c',
      label: 'C',
      ext: 'c',
      mime: 'text/x-csrc'
    },
    {
      name: 'cpp',
      label: 'C++',
      ext: 'cpp',
      mime: 'text/x-csrc'
    },
    {
      name: 'cpp11',
      label: 'C++11',
      ext: 'cpp',
      mime: 'text/x-csrc'
    },
    {
      name: 'java8',
      label: 'Java 8',
      ext: 'java',
      mime: 'text/java'
    },
  ];

  cmOptions = {
    indentUnit: 4,
    tabSize: 4,
    styleActiveLine: true,
    lineNumbers: true,
    styleSelectedText: true,
    line: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
    mode: 'text/x-csrc',
    version: null,
    // hint.js options
    hintOptions:{
      completeSingle: false
    },
    //keyMap: "sublime",
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: "solarized",
    extraKeys: { "Ctrl": "autocomplete" }
  };

  code: string = '' +
    '```\n\n' +
    'console.log("123");\n' +
    'console.log("234234");\n' +
    '```\n' +
    '- [ ] list1\n' +
    '- [x] list2\n\n' +
    '$x \\ge y$';

  get drawerVisible() {
    return !(this.drawer === 0);
  }

  handleSwitchProblem(set: number, idx: number) {
    console.log({set, idx});
    for (let i = 0; i < this.currentProblemIndex.length; ++i) {
      if (set === i) continue;
      this.currentProblemIndex[i] = -1;
    }
    this.currentProblemIndex[set] = idx;
    this.currentProblemSelection.set = set;
    this.currentProblemSelection.idx = idx;
    this.loadProblem();
    this.$toasted.info('答题进度已保存');
  }

  handleSwitchLanguage(idx: number) {
    if (0 <= idx && idx < this.languageList.length) {
      this.language = this.languageList[idx];
    }
  }

  handleDrawer() {
    if (this.drawer === 0) this.drawer = 2;
    else --this.drawer;
  }

  handleRefresh() {

  }

  handleMarkProblem() {
    // Todo: Mark the problem
  }

  handleUnmarkProblem() {

  }

  handleSaveAnswer() {
    // Todo: Save the answer of current problem
  }

  handleHandIn() {
    // TODO: Hand in
    this.handingIn = true;
    setTimeout(() => this.handingIn = false, 1000);
  }

  problemControl(cmd: string) {
    const problemSet = this.problemSets[this.currentProblemSelection.set];
    switch (cmd.toLowerCase()) {
      case 'next':
        if (this.currentProblemSelection.idx === problemSet.problems.length - 1) {
          if (this.currentProblemSelection.set === this.problemSets.length - 1) {
            // Last problem
            this.$toasted.info('已经是最后一题', {
              position: 'bottom-center'
            });
          }
          else {
            this.handleSwitchProblem(this.currentProblemSelection.set + 1, 0);
          }
        }
        else {
          this.handleSwitchProblem(this.currentProblemSelection.set, this.currentProblemSelection.idx + 1);
        }
        break;
      case 'prev':
        if (this.currentProblemSelection.idx === 0) {
          if (this.currentProblemSelection.set === 0) {
            // Last problem
            this.$toasted.info('已经是第一题', {
              position: 'bottom-center'
            });
          }
          else {
            this.handleSwitchProblem(
              this.currentProblemSelection.set - 1,
              this.problemSets[this.currentProblemSelection.set - 1].problems.length - 1
            );
          }
        }
        else {
          this.handleSwitchProblem(this.currentProblemSelection.set, this.currentProblemSelection.idx - 1);
        }
        break;
    }
  }

  loadProblem(problem: ProblemEntry | undefined = undefined) {
    let p: ProblemEntry | undefined = this.currentProblem;
    if (problem !== undefined) p = problem;
    if (p) {
      console.log('Loading');
      console.log(p);
    }
  }

  mounted() {
    vxm.app.changeTitle('活动标题');
    for (const set of this.problemSets) {
      this.currentProblemIndex.push(-1);
    }
    this.handleSwitchProblem(0, 0);
    this.language = this.languageList[0];
  }

}
</script>
<style>
  #problem-container {
    border-right: 1px solid rgba(0, 0, 0, .12);
  }
  #problem-sheet, #answer-sheet {
    max-height: calc( 100vh - 48px - 56px );
    overflow-y: auto;
  }
  .problem-chip-answered {
    background: white !important;
  }
  .problem-chip-marked {
    border: 1px solid rgba(255, 0, 0, .5) !important;
  }
  .CodeMirror {
    height: calc( 100vh - 24px - 48px - 56px - 48px );
  }
  pre, code {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace !important;
    font-weight: normal !important;
  }
  code {
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }
  .v-application code:after, .v-application code:before, .v-application kbd:after, .v-application kbd:before {
    content: '' !important;
  }
  html {
    overflow-y: hidden;
  }
</style>