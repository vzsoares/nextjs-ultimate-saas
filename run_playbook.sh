source ./.env
export UBUNTU_PASS
# ansible-playbook -i inventory.yaml playbook.yaml
ansible-playbook -i inventory.yaml playbook_docker.yaml --extra-vars "HOST=localubuntu" -vvv
