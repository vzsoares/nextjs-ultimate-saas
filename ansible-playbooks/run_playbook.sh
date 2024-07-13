source ../.env
export UBUNTU_PASS
export AWS_REGION
export AWS_ACCOUNT_ID
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export CONTAINER_IMAGE_NAME
export IMAGE_NAME
# ansible-playbook -i inventory.yaml playbook.yaml
ansible-playbook -i inventory.ansible.yaml playbook_docker.ansible.yaml --extra-vars "HOST=localubuntu" -vvv
