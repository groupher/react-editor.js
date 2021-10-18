/* eslint-disable no-unused-expressions */

import React from 'react';
import EditorJS, { EditorConfig, OutputData } from '@groupher/editor.js';

// @ts-ignore
import Undo from 'editorjs-undo';
// @ts-ignore
import DragDrop from 'editorjs-drag-drop';
// @ts-ignore
import Paragraph from '@groupher/editor-paragraph';
// @ts-ignore
import Header from '@groupher/editor-header';
// @ts-ignore
import Code from '@groupher/editor-code';
// @ts-ignore
// import LinkTool from '@groupher/editor-link';
// @ts-ignore
import Quote from '@groupher/editor-quote';
// @ts-ignore
import Delimiter from '@groupher/editor-delimiter';
// @ts-ignore
import InlineCode from '@groupher/editor-inline-code';

// @ts-ignore
import Embed from '@groupher/editor-embed';
// @ts-ignore
import Alert from '@groupher/editor-alert';
// @ts-ignore
import Table from '@groupher/editor-table';
// @ts-ignore
import List from '@groupher/editor-list';
// @ts-ignore
import Image from '@groupher/editor-image';
// @ts-ignore
import Quote from '@groupher/editor-quote';
// @ts-ignore
import Collapse from '@groupher/editor-collapse';
// @ts-ignore
import EventBus from '@groupher/editor-eventbus';
// @ts-ignore
import Strike from '@groupher/editor-strike';
// @ts-ignore
import Mention from '@groupher/editor-mention';

export interface WrapperProps extends EditorConfig {
  reinitOnPropsChange?: boolean;
  data?: OutputData;
  onData?: (data: OutputData) => void;
  holderId?: string;
  placeholder?: string;
}

export class EditorWrapper extends React.PureComponent<WrapperProps> {
  /**
   * Editor instance
   */
  public editor: EditorJS;

  /**
   * default id for editor.js holder
   */
  private defaultHolderId = 'editor-' + new Date().getTime();

  componentDidMount() {
    this.initEditor();
  }

  async componentDidUpdate() {
    const { reinitOnPropsChange } = this.props;

    if (reinitOnPropsChange) {
      const removed = await this.removeEditor();

      if (removed) {
        this.initEditor();
      }
    }
  }

  componentWillUnmount() {
    this.removeEditor();
  }

  async initEditor() {
    // const { holder: propHolderId, ...config } = this.props;
    const { holderId: propHolderId, placeholder } = this.props;
    const { handleChange } = this;

    const holderId = propHolderId ? propHolderId : this.defaultHolderId;

    const i18nConf = { i18n: 'zh' };
    this.editor = new EditorJS({
      holderId,
      tools: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            preserveBlank: true,
            placeholder: placeholder || "// 正文内容（'Tab' 键快速插入）",
          },
        },
        header: {
          class: Header,
          inlineToolbar: false,
        },
        /*
        linkTool: {
          class: LinkTool,
          shortcut: 'CMD+SHIFT+K',
        },
        */
        code: {
          class: Code,
          config: {
            lang: 'javascript',
          },
        },
        quote: {
          class: Quote,
        },
        delimiter: {
          class: Delimiter,
        },
        inlineCode: {
          class: InlineCode,
        },
        embed: {
          class: Embed,
        },
        alert: {
          class: Alert,
          inlineToolbar: true,
          config: {
            ...i18nConf,
          },
        },
        table: {
          class: Table,
          config: {
            ...i18nConf,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            ...i18nConf,
          },
        },
        collapse: {
          class: Collapse,
          inlineToolbar: true,
        },
        image: {
          class: Image,
          config: {
            ...i18nConf,
          },
        },
        mention: Mention,
        eventBus: EventBus,
        // fmarker: Marker,
        strike: Strike,
      },
      data: this.props.data,
      onChange: handleChange,
      onReady: () => {
        new Undo({ editor: this.editor });
        new DragDrop(this.editor);
      },
    });
  }

  handleChange = async () => {
    const { onChange, onData } = this.props;

    if (onChange && typeof onChange === 'function') {
      // onChange();
    }

    if (onData && typeof onData === 'function') {
      this.emitDataEvent(onData);
    }
  };

  emitDataEvent = async (cb: (data: OutputData) => void) => {
    try {
      const output = await this.editor.save();
      cb(output);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error('Saving failed: ', error);
    }
  };

  removeEditor = async () => {
    if (this.editor) {
      try {
        await this.editor.isReady;

        this.editor.destroy();
        // @ts-ignore
        delete this.editor;

        return true;
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.error(err);
        return false;
      }
    }

    return false;
  };

  render() {
    const { holderId: propHolderId } = this.props;
    const holderId = !propHolderId ? this.defaultHolderId : propHolderId;

    return <div id={holderId} />;
  }
}

export default EditorWrapper;
