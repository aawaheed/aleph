import React, { Component } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { updateEntitySet } from 'actions';
import { showSuccessToast, showWarningToast } from 'app/toast';
import { EntitySet } from 'components/common';
import FormDialog from 'dialogs/common/FormDialog';

const messages = defineMessages({
  save: {
    id: 'entityset.update.submit',
    defaultMessage: 'Save changes',
  },
  list_title: {
    id: 'list.update.title',
    defaultMessage: 'List settings',
  },
  list_label_placeholder: {
    id: 'list.update.label_placeholder',
    defaultMessage: 'Untitled list',
  },
  list_summary_placeholder: {
    id: 'list.update.summary_placeholder',
    defaultMessage: 'A brief description of the list',
  },
  list_success: {
    id: 'list.update.success',
    defaultMessage: 'Your list has been updated successfully.',
  },
  diagram_title: {
    id: 'diagram.update.title',
    defaultMessage: 'Diagram settings',
  },
  diagram_label_placeholder: {
    id: 'diagram.update.label_placeholder',
    defaultMessage: 'Untitled diagram',
  },
  diagram_summary_placeholder: {
    id: 'diagram.update.summary_placeholder',
    defaultMessage: 'A brief description of the diagram',
  },
  diagram_success: {
    id: 'diagram.update.success',
    defaultMessage: 'Your diagram has been updated successfully.',
  },
});


class EntitySetEditDialog extends Component {
  constructor(props) {
    super(props);
    const { entitySet } = this.props;

    this.state = {
      label: entitySet.label || '',
      summary: entitySet.summary || '',
      processing: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeLabel = this.onChangeLabel.bind(this);
    this.onChangeSummary = this.onChangeSummary.bind(this);
  }

  componentWillUnmount() {
    this.setState({
      label: '',
      summary: '',
    });
  }

  async onSubmit(event) {
    const { entitySet, intl, type } = this.props;
    const { label, processing, summary } = this.state;
    event.preventDefault();
    if (processing || !this.checkValid()) return;
    this.setState({ processing: true });

    try {
      await this.props.updateEntitySet(entitySet.id, { label, summary });
      this.setState({ processing: false });
      this.props.toggleDialog();

      console.log(`${type}_success`)

      showSuccessToast(
        intl.formatMessage(messages[`${type}_success`]),
      );
    } catch (e) {
      showWarningToast(e.message);
      this.setState({ processing: false });
    }
  }

  onChangeLabel({ target }) {
    this.setState({ label: target.value });
  }

  onChangeSummary({ target }) {
    this.setState({ summary: target.value });
  }

  checkValid() {
    const { label } = this.state;
    return label?.length > 0;
  }

  render() {
    const { entitySet, intl, isOpen, toggleDialog } = this.props;
    const { label, processing, summary } = this.state;
    const disabled = !this.checkValid();

    const { type } = entitySet;

    return (
      <FormDialog
        processing={processing}
        icon={<EntitySet.Icon entitySet={{ type }} />}
        isOpen={isOpen}
        title={intl.formatMessage(messages[`${type}_title`])}
        onClose={toggleDialog}
      >
        <form onSubmit={this.onSubmit}>
          <div className="bp3-dialog-body">
            <div className="bp3-form-group">
              <label className="bp3-label" htmlFor="label">
                <FormattedMessage id="entityset.choose.name" defaultMessage="Title" />
                <div className="bp3-input-group bp3-fill">
                  <input
                    id="label"
                    type="text"
                    className="bp3-input"
                    autoComplete="off"
                    placeholder={intl.formatMessage(messages[`${type}_label_placeholder`])}
                    onChange={this.onChangeLabel}
                    value={label}
                  />
                </div>
              </label>
            </div>
            <div className="bp3-form-group">
              <label className="bp3-label" htmlFor="summary">
                <FormattedMessage
                  id="entityset.choose.summary"
                  defaultMessage="Summary"
                />
                <div className="bp3-input-group bp3-fill">
                  <textarea
                    id="summary"
                    className="bp3-input"
                    placeholder={intl.formatMessage(messages[`${type}_summary_placeholder`])}
                    onChange={this.onChangeSummary}
                    value={summary}
                    rows={5}
                  />
                </div>
              </label>
            </div>
          </div>
          <div className="bp3-dialog-footer">
            <div className="bp3-dialog-footer-actions">
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                disabled={disabled}
                text={intl.formatMessage(messages.save)}
              />
            </div>
          </div>
        </form>
      </FormDialog>
    );
  }
}

EntitySetEditDialog = injectIntl(EntitySetEditDialog);
export default connect(null, { updateEntitySet })(EntitySetEditDialog);
