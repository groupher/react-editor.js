import React from 'react';
import EditorJS, { EditorConfig, OutputData } from '@groupher/editor';

// @ts-ignore
import Header from '@groupher/editor-header';
// @ts-ignore
import Code from '@groupher/editor-code';
// @ts-ignore
import LinkTool from '@groupher/editor-link';
// @ts-ignore
import Quote from '@groupher/editor-quote';
// @ts-ignore
import Delimiter from '@groupher/editor-delimiter';
// @ts-ignore
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import Embed from '@groupher/editor-embed';
// @ts-ignore
import Warning from '@groupher/editor-warning';
// @ts-ignore
import Table from '@groupher/editor-table';
// @ts-ignore
import List from '@groupher/editor-list';
// @ts-ignore
import Checklist from '@groupher/editor-checklist';
// @ts-ignore
import Image from '@groupher/editor-image';
// @ts-ignore
import Quote from '@groupher/editor-quote';

export interface WrapperProps extends EditorConfig {
  reinitOnPropsChange?: boolean;
  onData?: (data: OutputData) => void;
  holderId?: string;
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
    const { holderId: propHolderId } = this.props;
    const { handleChange } = this;

    const holderId = propHolderId ? propHolderId : this.defaultHolderId;

    const i18nConf = { i18n: 'zh' };
    this.editor = new EditorJS({
      holderId,
      tools: {
        header: {
          class: Header,
          inlineToolbar: false,
          shortcut: 'CMD+SHIFT+H',
        },
        linkTool: {
          class: LinkTool,
          shortcut: 'CMD+SHIFT+K',
        },
        code: {
          class: Code,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+C',
          config: {
            lang: 'javascript',
          },
        },
        quote: {
          class: Quote,
          shortcut: 'CMD+SHIFT+Y',
        },
        delimiter: {
          class: Delimiter,
          shortcut: 'CMD+SHIFT+D',
        },
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+I',
        },
        embed: {
          class: Embed,
          shortcut: 'CMD+SHIFT+E',
        },
        warning: {
          class: Warning,
          shortcut: 'CMD+SHIFT+W',
          config: {
            ...i18nConf,
          },
        },
        table: {
          class: Table,
          shortcut: 'CMD+SHIFT+T',
          config: {
            ...i18nConf,
          },
        },
        list: {
          class: List,
          shortcut: 'CMD+SHIFT+L',
          config: {
            ...i18nConf,
          },
        },
        checklist: {
          class: Checklist,
          shortcut: 'CMD+SHIFT+O',
          config: {
            ...i18nConf,
          },
        },
        image: {
          class: Image,
          shortcut: 'CMD+SHIFT+I',
          config: {
            ...i18nConf,
          },
        },
      },
      onChange: handleChange,
    });
  }

  handleChange = async () => {
    const { onChange, onData } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange();
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
