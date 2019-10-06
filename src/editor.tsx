import React from 'react';
import EditorJS, { EditorConfig, OutputData } from '@groupher/editor';

// @ts-ignore
import Header from '@groupher/editor-header';
// import Code from '@groupher/editor-code';
// import LinkTool from '@groupher/editor-link';
// import Quote from '@groupher/editor-quote';

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
   * Node to append ref
   */
  private node = React.createRef<HTMLDivElement>();
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

    this.editor = new EditorJS({
      holderId,
      tools: {
        header: {
          class: Header,
          inlineToolbar: false,
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

  getHolderNode = () => {
    const holder = this.node.current;

    if (!holder) {
      throw new Error('No node to append Editor.js');
    }

    return holder;
  };

  render() {
    const { holderId: propHolderId } = this.props;
    const holderId = !propHolderId ? this.defaultHolderId : propHolderId;

    return <div id={holderId} />;
  }
}

export default EditorWrapper;
