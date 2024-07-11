source ./.env
export UBUNTU_PASS
export AWS_REGION
export AWS_ACCOUNT_ID
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
# ansible-playbook -i inventory.yaml playbook.yaml
ansible-playbook -i inventory.yaml playbook_docker.yaml --extra-vars "HOST=localubuntu" -vvv
