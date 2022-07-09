describe('Full flow', () => {
  it('should cover all functionality', () => {
    const newUser = {
      name: 'cypressuser',
      email: 'test@cypress.com',
      password: 'cypress123',
      avatar: 'cypress/fixtures/default.png'
    }
    
    // it will redirect to login page
    cy.visit('/')

    /* ------ Test Login credentials ------ */
    cy.findByRole('textbox', { name: /email/i }).type(newUser.email)
    cy.findByLabelText(/password/i).type(newUser.password)
    cy.findByRole('button', { name: /login/i }).click()

    cy.get('.invalid_credentials-error').should('be.visible')
 
    /* ------ Create an account ------ */
    cy.findByRole('link', { name: /create account/i }).click()
    
    cy.findByRole('textbox', { name: /name/i }).type(newUser.name)
    cy.findByRole('textbox', { name: /email/i }).type(newUser.email)
    cy.findByTestId('passwordInput').type(newUser.password)
    cy.findByLabelText(/confirm password/i).type(newUser.password)

    cy.findByRole('button', { name: /next/i }).click()
    
    cy.findByTestId('avatarLabel').selectFile(newUser.avatar)

    cy.findByRole('button', { name: /register/i }).click()

    /* ------ Access Profile ------ */
    cy.findByRole('banner').within(() => {
      cy.findByRole('link', { name: /profile/i }).click({ force: true })
    })
    cy.location('href').should('contain', '/users/')

    /* ------ Create a post ------ */
    const newPost = {
      description: 'Cypress e2e test',
      image: 'cypress/fixtures/default.png'
    }

    cy.get('.social_media_app-user_page').within(() => {
      cy.get('#descriptionTextarea').type(newPost.description)
      cy.findByTestId('postImageLabel').selectFile(newPost.image)
      
      //Selecting feeling
      cy.findByTestId('feelingsPickerOption').click()
      cy.get('.new_post_input-component > .feelings_picker-component > .feelings_picker-modal > .feelings-list > :nth-child(2)').click()
      
      cy.findByRole('button', { name: /share/i }).click()
    })

    /* ------ Like the post ------ */
    cy.get('.post-component').within(() => {
      cy.get('.actions-list > :nth-child(1)').click()
    })

    /* ------ Edit the post ------ */
    const newPostContent = {
      description: 'Cypress updating the post'
    }
    cy.get('.post-component').within(() => {
      cy.get('[alt="post options"]').click()
      cy.get('.submenu-list > :nth-child(1)').click()

      cy.get('.edit_post-modal').within(() => {
        //Selecting feeling
        cy.get('.footer > .options-list > .options-item').click()
        cy.get('.container > .feelings_picker-component > .feelings_picker-modal > .feelings-list > :nth-child(3)').click()
        cy.get('.main_content > textarea').clear().type(newPostContent.description)
        cy.findByRole('button', { name: /edit/i }).click()
      })
    })

    /* ------ Create a comment ------ */
    const newComment = {
      message: 'Cypress adding a comment'
    }
    cy.get('.post-component').within(() => {
      cy.get('.actions-list > :nth-child(2)').click()
      cy.get('.new_comment-input').type(newComment.message + '{enter}')
    })

    /* ------ Edit the comment ------ */
    const newCommentContent = {
      message: 'Cypress updating the comment'
    }
    cy.get('.post-component').within(() => {
      cy.get('.comment').within(() => {
        cy.get('.main > .options-box').click()
        cy.get('.submenu > ul > :nth-child(1)').click()

        cy.get('.edit_comment-modal').within(() => {
          cy.get('textarea').clear().type(newCommentContent.message)
          cy.findByRole('button', { name: /edit/i }).click()
        })
      })
    })

    /* ------ Delete the comment ------ */
    cy.get('.post-component').within(() => {
      cy.get('.comment').within(() => {
        cy.get('.main > .options-box').click()
        cy.get('.submenu > ul > :nth-child(2)').click()

        cy.get('.message').should('have.text', 'deleted')
      })
    })

    /* ------ Delete the post ------ */
    cy.get('.post-component').within(() => {
      cy.get('[alt="post options"]').click()
      cy.get('.submenu-list > :nth-child(2)').click()

      cy.findByRole('button', { name: /delete/i }).click()
    })

    /* ------ Change cover photo ------ */
    const newCoverPhoto = {
      image: 'cypress/fixtures/default.png'
    }
    cy.findByText(/edit cover photo/i).selectFile(newCoverPhoto.image)
    cy.findByRole('button', { name: /pencil icon edit profile/i }).click()

    /* ------ Change profile picture ------ */
    const newAvatar = {
      image: 'cypress/fixtures/default.png'
    }
    cy.get('.profile_user_image-box').within(() => {
      cy.get('label').selectFile(newAvatar.image)
      cy.get('.change-button').click()
    })

    /* ------ Access settings  ------ */
    cy.findByRole('banner').within(() => {
      cy.findByRole('link', { name: /settings/i }).click({ force: true })
    })
    cy.location('href').should('contain', '/settings')

    /* ------ Change email address  ------ */
    const newUserCredentials = {
      email: 'cypress@anotheremail.com',
      password: 'cypressanotherpassword123'
    }
    cy.get('#ChangeEmailFormNewEmail').clear().type(newUserCredentials.email)
    cy.get('#ChangeEmailFormCurrentPassword').type(newUser.password)
    cy.get('.change_email-button').click()
    
    /* ------ Change password  ------ */
    cy.get('#ChangePasswordFormCurrentPassowrd').type(newUser.password)
    cy.get('#ChangePasswordFormNewPassword').type(newUserCredentials.password)
    cy.get('#ChangePasswordFormConfirmNewPassword').type(newUserCredentials.password)
    cy.get('.change_password-button').click()

    /* ------ Log out  ------ */
    cy.findByRole('banner').within(() => {
      cy.findByText(/log out/i).click({ force: true })
    })
    cy.location('href').should('contain', '/login')
    
    /* ------ Log in with the new credentials  ------ */
    cy.get('.social_media_app-login').within(() => {
      cy.findByRole('textbox', { name: /email/i }).type(newUserCredentials.email)
      cy.findByLabelText(/password/i).type(newUserCredentials.password)
      cy.findByRole('button', { name: /login/i }).click()
    })

    /* ------ Delete account  ------ */
    cy.findByRole('banner').within(() => {
      cy.findByRole('link', { name: /settings/i }).click({ force: true })
    })
    cy.location('href').should('contain', '/settings')

    cy.get('.settings-nav').within(() => {
      cy.get('.items > .delete').click()
    })
    cy.get('.delete_account-modal').within(() => {
      cy.get('.actions-box > .delete').click()
    })
  })
})