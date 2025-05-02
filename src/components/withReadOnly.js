import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';

const withReadOnly = (WrappedComponent) => {
  return function WithReadOnlyComponent(props) {
    const { role } = useSelector(state => state.auth);
    const isManager = role === 'MANAGER';

    // If the user is a manager, disable all interactive elements
    const readOnlyProps = isManager ? {
      ...props,
      readOnly: true,
      className: `${props.className || ''} read-only`,
      // Disable all interactive elements
      disableEditing: true,
      disableActions: true,
      // Override any action handlers
      onEdit: () => {},
      onDelete: () => {},
      onAdd: () => {},
      onSubmit: (e) => {
        e?.preventDefault();
        e?.stopPropagation();
      },
      onClick: (e) => {
        e?.preventDefault();
        e?.stopPropagation();
      },
      // Disable form controls
      disabled: true,
      // Pass isManager flag
      isManager: true
    } : props;

    return (
      <div className={isManager ? 'read-only-container' : ''}>
        {isManager && (
          <Alert variant="info" className="mb-3">
            <Alert.Heading>
              <i className="fas fa-eye me-2"></i>
              Read-Only Mode
            </Alert.Heading>
            <p className="mb-0">
              As a manager, you have view-only access to this section. You cannot modify any content.
              All edit, delete, and create actions are disabled.
            </p>
          </Alert>
        )}
        <WrappedComponent {...readOnlyProps} />
      </div>
    );
  };
};

export default withReadOnly; 